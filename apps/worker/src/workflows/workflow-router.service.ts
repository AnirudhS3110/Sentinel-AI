import { Injectable } from '@nestjs/common';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { ValidationOutput, WorkflowGraphState } from '@sentinel/shared';

const WorkflowState = Annotation.Root({
  incidentId: Annotation<string>,
  workflowExecutionId: Annotation<string>,
  userId: Annotation<string>,
  title: Annotation<string>,
  description: Annotation<string | undefined>,
  rawLogs: Annotation<string>,
  currentStage: Annotation<string>,
  retryCount: Annotation<number>,
  validationOutput: Annotation<ValidationOutput | undefined>,
  error: Annotation<string | undefined>,
});

type GraphState = typeof WorkflowState.State;

@Injectable()
export class WorkflowRouterService {
  private graph = this.buildGraph();

  private buildGraph() {
    const graph = new StateGraph(WorkflowState)
      .addNode('check_validation', (state: GraphState) => state)
      .addEdge(START, 'check_validation')
      .addConditionalEdges('check_validation', (state: GraphState) => {
        const v = state.validationOutput;
        if (!v) return 'remediation';
        if (!v.valid && v.requiresRetry && state.retryCount < 3) return 'retry_analysis';
        if (!v.valid) return 'failed';
        return 'remediation';
      }, {
        retry_analysis: END,
        remediation: END,
        failed: END,
      });
    return graph.compile();
  }

  async routeAfterValidation(state: WorkflowGraphState): Promise<'retry_analysis' | 'remediation' | 'failed'> {
    const result = await this.graph.invoke({
      incidentId: state.incidentId,
      workflowExecutionId: state.workflowExecutionId,
      userId: state.userId,
      title: state.title,
      description: state.description,
      rawLogs: state.rawLogs,
      currentStage: state.currentStage,
      retryCount: state.retryCount,
      validationOutput: state.validationOutput,
    });
    const v = result.validationOutput;
    if (!v?.valid && v?.requiresRetry && state.retryCount < 3) return 'retry_analysis';
    if (!v?.valid) return 'failed';
    return 'remediation';
  }
}
