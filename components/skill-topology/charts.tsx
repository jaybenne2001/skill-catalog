"use client";

import { useMemo } from "react";
import type { RadarData, SankeyData, SankeyNodeGroup } from "@/lib/skill-matcher";

interface PositionedNode {
  id: string;
  label: string;
  group: SankeyNodeGroup;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

function layoutNodes(
  nodes: PositionedNode[],
  height: number,
  marginTop: number,
  marginBottom: number
) {
  const padding = 12;
  const totalValue = nodes.reduce((sum, node) => sum + node.value, 0);
  const available = height - marginTop - marginBottom - padding * Math.max(0, nodes.length - 1);
  const scale = totalValue > 0 ? available / totalValue : 0;

  const baseHeights = nodes.map(node => Math.max(12, node.value * scale));
  const baseTotal = baseHeights.reduce((sum, h) => sum + h, 0);
  const adjustedScale =
    baseTotal > 0 && baseTotal > available ? available / baseTotal : 1;

  let y = marginTop;
  return nodes.map((node, index) => {
    const heightValue = baseHeights[index] * adjustedScale;
    const positioned = { ...node, y, height: heightValue };
    y += heightValue + padding;
    return positioned;
  });
}

export function SankeyChart({ data }: { data: SankeyData }) {
  const width = 900;
  const height = 420;
  const marginTop = 20;
  const marginBottom = 20;
  const nodeWidth = 170;

  const grouped = useMemo(() => {
    const groups: Record<SankeyNodeGroup, PositionedNode[]> = {
      resume: [],
      capability: [],
      job: [],
    };

    for (const node of data.nodes) {
      groups[node.group].push({
        ...node,
        x: 0,
        y: 0,
        width: nodeWidth,
        height: 0,
      });
    }

    for (const group of Object.keys(groups) as SankeyNodeGroup[]) {
      groups[group].sort((a, b) => b.value - a.value);
    }

    const xPositions: Record<SankeyNodeGroup, number> = {
      resume: 24,
      capability: width / 2 - nodeWidth / 2,
      job: width - nodeWidth - 24,
    };

    for (const group of Object.keys(groups) as SankeyNodeGroup[]) {
      groups[group] = layoutNodes(
        groups[group].map(node => ({ ...node, x: xPositions[group] })),
        height,
        marginTop,
        marginBottom
      );
    }

    return groups;
  }, [data.nodes]);

  const nodeById = useMemo(() => {
    const map = new Map<string, PositionedNode>();
    for (const group of Object.values(grouped)) {
      for (const node of group) {
        map.set(node.id, node);
      }
    }
    return map;
  }, [grouped]);

  const nodeColors: Record<SankeyNodeGroup, string> = {
    resume: "#2563EB",
    capability: "#10B981",
    job: "#F97316",
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <rect width={width} height={height} fill="#F8FAFC" rx={18} />

      {data.links.map((link, index) => {
        const source = nodeById.get(link.source);
        const target = nodeById.get(link.target);
        if (!source || !target) return null;

        const sx = source.x + source.width;
        const sy = source.y + source.height / 2;
        const tx = target.x;
        const ty = target.y + target.height / 2;
        const cx1 = sx + (tx - sx) * 0.4;
        const cx2 = sx + (tx - sx) * 0.6;
        const strokeWidth = Math.max(1, link.value * 2);

        return (
          <path
            key={`${link.source}-${link.target}-${index}`}
            d={`M ${sx} ${sy} C ${cx1} ${sy} ${cx2} ${ty} ${tx} ${ty}`}
            stroke="#94A3B8"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.45}
          />
        );
      })}

      {[...grouped.resume, ...grouped.capability, ...grouped.job].map(node => (
        <g key={node.id}>
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={10}
            fill={nodeColors[node.group]}
            opacity={0.9}
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="white"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function RadarChart({ data }: { data: RadarData }) {
  const size = 420;
  const center = size / 2;
  const radius = 150;
  const steps = 5;
  const axes = data.categories.length;

  const toPoint = (value: number, index: number) => {
    const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const resumePoints = data.resume.map((value, index) => toPoint(value, index));
  const jobPoints = data.job.map((value, index) => toPoint(value, index));

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-md mx-auto">
      <rect width={size} height={size} fill="#F8FAFC" rx={18} />

      {Array.from({ length: steps }).map((_, step) => {
        const r = ((step + 1) / steps) * radius;
        return (
          <circle
            key={`grid-${step}`}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="#E2E8F0"
          />
        );
      })}

      {data.categories.map((label, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        const labelX = center + (radius + 18) * Math.cos(angle);
        const labelY = center + (radius + 18) * Math.sin(angle);

        return (
          <g key={label}>
            <line x1={center} y1={center} x2={x} y2={y} stroke="#E2E8F0" />
            <text
              x={labelX}
              y={labelY}
              fontSize="11"
              textAnchor={labelX < center - 8 ? "end" : labelX > center + 8 ? "start" : "middle"}
              dominantBaseline="middle"
              fill="#475569"
            >
              {label}
            </text>
          </g>
        );
      })}

      <path d={toPath(jobPoints)} fill="#F97316" opacity={0.25} stroke="#F97316" strokeWidth={2} />
      <path d={toPath(resumePoints)} fill="#2563EB" opacity={0.3} stroke="#2563EB" strokeWidth={2} />

      <g>
        <rect x={24} y={20} width={10} height={10} fill="#2563EB" />
        <text x={40} y={28} fontSize="12" fill="#334155">
          Resume strength
        </text>
        <rect x={24} y={40} width={10} height={10} fill="#F97316" />
        <text x={40} y={48} fontSize="12" fill="#334155">
          Job requirements
        </text>
      </g>
    </svg>
  );
}
