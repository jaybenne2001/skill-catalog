"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RadarData, SankeyData, SankeyNodeGroup } from "@/lib/skill-matcher";

interface AnalysisPayload {
  keyword_match: number;
  capability_match: number;
  delta: number;
  gaps: string[];
  sankey?: SankeyData;
  radar?: RadarData;
  job_techs?: string[];
  resume_techs?: string[];
}

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

function SankeyChart({ data }: { data: SankeyData }) {
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

function RadarChart({ data }: { data: RadarData }) {
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

function ResultsContent() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisPayload | null>(null);
  const [analysisLoaded, setAnalysisLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("skillAnalysis");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalysisPayload;
        setAnalysis(parsed);
      } catch {
        setAnalysis(null);
      }
    }
    setAnalysisLoaded(true);
  }, []);

  const keyword = searchParams.get("keyword") ?? "0";
  const capability = searchParams.get("capability") ?? "0";
  const delta = searchParams.get("delta") ?? "0";
  const gaps =
    analysis?.gaps ??
    (searchParams.get("gaps")?.split(",").map(s => s.trim()).filter(Boolean) ?? []);

  const deltaNum = Number.parseInt(delta, 10);
  const showStrongMatch = Number.isFinite(deltaNum) && deltaNum > 20;

  const sankeyData = analysis?.sankey;
  const radarData = analysis?.radar;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/skill-topology/analyze">
            <Button variant="outline">← Analyze Another</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">Analysis Results</h1>
        <p className="text-center text-gray-600 mb-12">
          Your skills vs job requirements
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center bg-red-50 border-red-200">
            <div className="text-6xl font-bold text-red-600 mb-3">
              {keyword}%
            </div>
            <div className="text-sm text-gray-600">Traditional ATS</div>
            <div className="text-xs text-gray-500 mt-2">Keyword Match</div>
          </Card>

          <Card className="p-8 text-center bg-green-50 border-green-200">
            <div className="text-6xl font-bold text-green-600 mb-3">
              {capability}%
            </div>
            <div className="text-sm text-gray-600">Skill Topology</div>
            <div className="text-xs text-gray-500 mt-2">Capability Match</div>
          </Card>

          <Card className="p-8 text-center bg-blue-50 border-blue-200">
            <div className="text-6xl font-bold text-blue-600 mb-3">
              {deltaNum >= 0 ? "+" : ""}
              {delta}
            </div>
            <div className="text-sm text-gray-600">Hidden Value</div>
            <div className="text-xs text-gray-500 mt-2">Percentage Points</div>
          </Card>
        </div>

        {showStrongMatch && (
          <Card className="p-8 mb-12 bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold mb-4">Strong Capability Match</h2>
            <p className="text-gray-700">
              While traditional keyword matching shows {keyword}%, your actual
              capability coverage is {capability}%. You have{" "}
              <strong>{delta} percentage points of hidden value</strong> that
              most ATS systems would miss. Your transferable skills make you
              more qualified than the keyword match suggests.
            </p>
          </Card>
        )}

        <div className="space-y-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Skill Consolidation Flow (Sankey Diagram)
            </h2>
            <p className="text-gray-600 mb-6">
              This chart shows how your technologies map through root
              capabilities to job requirements.
            </p>

            {sankeyData && sankeyData.nodes.length > 0 ? (
              <SankeyChart data={sankeyData} />
            ) : (
              <div className="bg-slate-50 rounded-lg p-12 text-center border border-dashed border-slate-200">
                <p className="text-sm text-gray-500">
                  No flow data available. Run an analysis to generate the chart.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Capability Coverage (Radar Chart)
            </h2>
            <p className="text-gray-600 mb-6">
              Compares your capability strength across core dimensions vs job
              requirements.
            </p>

            {radarData ? (
              <RadarChart data={radarData} />
            ) : (
              <div className="bg-slate-50 rounded-lg p-12 text-center border border-dashed border-slate-200">
                <p className="text-sm text-gray-500">
                  No radar data available. Run an analysis to generate the chart.
                </p>
              </div>
            )}
          </Card>

          {gaps.length > 0 && (
            <Card className="p-8 bg-orange-50 border-orange-200">
              <h2 className="text-2xl font-bold mb-4">Gap Analysis</h2>
              <p className="text-gray-600 mb-4">
                Technologies required by job but not explicitly on resume:
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {gaps.map(gap => (
                  <span
                    key={gap}
                    className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {gap}
                  </span>
                ))}
              </div>

              <div className="bg-white rounded-lg p-6">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Interview strategy
                </p>
                <p className="text-sm text-gray-600">
                  Focus on transferable capabilities. For example: While I
                  have not used the missing tool specifically, I have extensive
                  experience with similar systems that provide the same
                  capabilities.
                </p>
              </div>
            </Card>
          )}
        </div>

        {!analysisLoaded && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Loading analysis details...
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/skill-topology/analyze">
            <Button size="lg">Analyze Another →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading results...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
