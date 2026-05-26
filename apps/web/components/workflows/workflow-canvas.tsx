'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PIPELINE_STAGES } from '@/lib/workflow-stages';
import type { WorkflowRun } from '@/lib/workflows-data';
import { nodeStatesForRun, shouldShowRetryPath } from '@/lib/workflows-data';
import type { WorkflowEventPayload } from '@sentinel/shared';
import { WorkflowStageNode, type WorkflowNodeData } from './workflow-stage-node';
import { WorkflowPipelineEdge } from './workflow-pipeline-edge';

const nodeTypes = { workflowStage: WorkflowStageNode };
const edgeTypes = { pipeline: WorkflowPipelineEdge };

// Tighter horizontal gap so nodes spread across the canvas width properly
const X_GAP = 185;
const Y_CENTER = 100;

export function WorkflowCanvas({
  run,
  events,
}: {
  run: WorkflowRun | null;
  events: WorkflowEventPayload[];
}) {
  const showRetry = shouldShowRetryPath(run, events);
  const states = nodeStatesForRun(run, showRetry);

  const { nodes, edges } = useMemo(() => {
    const currentIdx = run
      ? states.findIndex((s) => s === 'running' || s === 'retrying' || s === 'failed')
      : 0;
    const activeIdx = currentIdx >= 0 ? currentIdx : 0;

    const ns: Node[] = PIPELINE_STAGES.map((stage, i) => ({
      id: stage.key,
      type: 'workflowStage',
      position: { x: i * X_GAP, y: Y_CENTER },
      data: {
        label: stage.label,
        stageKey: stage.key,
        state: states[i],
        duration:
          states[i] === 'completed'
            ? `${(1.1 + i * 0.3).toFixed(1)}s`
            : states[i] === 'running'
              ? '…'
              : '—',
        retries: run?.retries && i === 3 ? run.retries : 0,
      } satisfies WorkflowNodeData,
    }));

    const es: Edge[] = [];
    for (let i = 0; i < PIPELINE_STAGES.length - 1; i++) {
      let edgeKind: 'default' | 'completed' | 'active' | 'failed' | 'retry' = 'default';
      if (states[i] === 'completed' && states[i + 1] === 'completed') edgeKind = 'completed';
      if (i === activeIdx) edgeKind = 'active';
      if (states[i] === 'failed') edgeKind = 'failed';
      es.push({
        id: `e-${i}`,
        source: PIPELINE_STAGES[i].key,
        target: PIPELINE_STAGES[i + 1].key,
        type: 'pipeline',
        data: { edgeKind },
      });
    }

    if (showRetry) {
      es.push({
        id: 'retry-loop',
        source: 'REMEDIATION',
        target: 'VALIDATION',
        type: 'pipeline',
        data: { edgeKind: 'retry' },
        style: { strokeDasharray: '6 4' },
      });
    }

    return { nodes: ns, edges: es };
  }, [run, states, showRetry]);

  // Progress calculation
  const completedCount = states.filter((s) => s === 'completed').length;
  const totalCount = states.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentStage = run
    ? PIPELINE_STAGES.find((_, i) => states[i] === 'running' || states[i] === 'retrying')
    : null;

  const runningIdx = states.findIndex((s) => s === 'running' || s === 'retrying');

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(9,13,26,0.85)] shadow-[0_12px_48px_rgba(0,0,0,0.4)] backdrop-blur-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.06)] px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-[#f8fafc]">Orchestration Canvas</p>
              {currentStage && (
                <span className="rounded-full border border-[rgba(139,92,246,0.25)] bg-[#8b5cf6]/10 px-2 py-0.5 text-[10px] font-semibold text-[#a78bfa]">
                  ◈ {currentStage.label}
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-[#475569]">
              {run
                ? `${run.incidentTitle} · live execution graph`
                : 'Select a workflow run to visualize'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Stage progress pills */}
          {run && (
            <div className="hidden items-center gap-1 sm:flex">
              {PIPELINE_STAGES.map((stage, i) => (
                <div
                  key={stage.key}
                  className="h-1.5 w-5 rounded-full transition-all duration-500"
                  style={{
                    background:
                      states[i] === 'completed'
                        ? '#10b981'
                        : states[i] === 'running' || states[i] === 'retrying'
                          ? '#8b5cf6'
                          : states[i] === 'failed'
                            ? '#ef4444'
                            : 'rgba(255,255,255,0.08)',
                    boxShadow:
                      states[i] === 'running'
                        ? '0 0 8px rgba(139,92,246,0.8)'
                        : states[i] === 'completed'
                          ? '0 0 6px rgba(16,185,129,0.5)'
                          : 'none',
                  }}
                  title={stage.label}
                />
              ))}
            </div>
          )}

          {/* Progress % */}
          {run && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                    boxShadow: '0 0 6px rgba(124,58,237,0.6)',
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-[#64748b]">
                {progressPct}%
              </span>
            </div>
          )}

          {/* Live badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-[rgba(16,185,129,0.2)] bg-[#10b981]/8 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#10b981] opacity-60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#10b981]">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Canvas — constrained height, fitView ensures nodes fill the space */}
      <div className="relative" style={{ height: 300 }}>
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full blur-3xl"
            style={{
              width: 200,
              height: 200,
              left: `${(runningIdx >= 0 ? runningIdx : 3) * 14}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
            }}
          />
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.18, minZoom: 0.6, maxZoom: 1.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          className="!h-full !bg-transparent"
        >
          <Background
            gap={20}
            size={0.8}
            color="rgba(255,255,255,0.03)"
          />
          <Controls
            showInteractive={false}
            showFitView
            className="!rounded-xl !border-[rgba(255,255,255,0.07)] !bg-[#0b1020]/90 !shadow-xl"
            style={{ bottom: 12, right: 12 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
