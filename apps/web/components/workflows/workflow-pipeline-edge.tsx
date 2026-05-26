'use client';

import { memo } from 'react';
import {
  BaseEdge,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

export type PipelineEdgeData = {
  edgeKind?: 'default' | 'completed' | 'active' | 'failed' | 'retry';
};

function WorkflowPipelineEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const kind = (data as PipelineEdgeData)?.edgeKind ?? 'default';
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  });

  const isActive = kind === 'active';
  const isRetry = kind === 'retry';
  const isCompleted = kind === 'completed';
  const isFailed = kind === 'failed';

  const strokeColor =
    isCompleted
      ? '#10b981'
      : isActive
        ? 'url(#edge-gradient-active)'
        : isFailed
          ? '#ef4444'
          : isRetry
            ? '#f59e0b'
            : '#1e293b';

  const strokeWidth = isActive || isRetry ? 2.5 : isCompleted ? 2 : 1.5;
  const opacity = kind === 'default' ? 0.5 : 1;

  const particleColor = isRetry ? '#f59e0b' : '#06b6d4';
  const particleColor2 = isActive ? '#8b5cf6' : particleColor;

  return (
    <>
      <defs>
        <linearGradient id="edge-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id={`glow-edge-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Glow duplicate for active edges */}
      {(isActive || isRetry || isCompleted) && (
        <BaseEdge
          id={`${id}-glow`}
          path={path}
          style={{
            stroke: isCompleted ? '#10b981' : isRetry ? '#f59e0b' : '#8b5cf6',
            strokeWidth: strokeWidth + 4,
            opacity: 0.15,
            filter: `blur(3px)`,
          }}
        />
      )}

      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: strokeColor,
          strokeWidth,
          opacity,
          strokeDasharray: isRetry ? '6 4' : undefined,
        }}
      />

      {/* Primary particle */}
      {(isActive || isRetry) && (
        <circle r="4" fill={particleColor} style={{ filter: `drop-shadow(0 0 4px ${particleColor})` }}>
          <animateMotion dur={isRetry ? '2.5s' : '1.8s'} repeatCount="indefinite" path={path} />
        </circle>
      )}

      {/* Secondary particle (active only) */}
      {isActive && (
        <circle r="2.5" fill={particleColor2} style={{ filter: `drop-shadow(0 0 3px ${particleColor2})`, opacity: 0.7 }}>
          <animateMotion dur="2.8s" repeatCount="indefinite" path={path} begin="0.9s" />
        </circle>
      )}

      {/* Third particle for active */}
      {isActive && (
        <circle r="2" fill="#10b981" style={{ filter: 'drop-shadow(0 0 3px #10b981)', opacity: 0.5 }}>
          <animateMotion dur="3.2s" repeatCount="indefinite" path={path} begin="1.6s" />
        </circle>
      )}
    </>
  );
}

export const WorkflowPipelineEdge = memo(WorkflowPipelineEdgeComponent);
