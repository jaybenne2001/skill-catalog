"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RadarData, SankeyData } from "@/lib/skill-matcher";
import { CAPABILITY_AXES } from "@/lib/skill-matcher";
import { RadarChart, SankeyChart } from "@/components/skill-topology/charts";

interface AnalysisPayload {
  keyword_match: number;
  capability_match: number;
  delta: number;
  gaps: string[];
  sankey?: SankeyData;
  radar?: RadarData;
  job_techs?: string[];
  resume_techs?: string[];
  job_caps?: Record<string, number>;
  resume_caps?: Record<string, number>;
  job_tech_counts?: Record<string, number>;
  resume_tech_counts?: Record<string, number>;
  ats_priority?: Array<{
    tech: string;
    occurrences: number;
    capability_weight: number;
    score: number;
  }>;
  transfer_map?: Record<string, { resume_techs: string[]; shared_caps: string[] }>;
  risk_flags?: string[];
}


function ResultsContent() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<AnalysisPayload | null>(null);
  const [analysisLoaded, setAnalysisLoaded] = useState(false);
  const [recencyWeight, setRecencyWeight] = useState(3);
  const [depthWeight, setDepthWeight] = useState(3);

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
  const keywordNum = Number.parseInt(keyword, 10);
  const capabilityNum = Number.parseInt(capability, 10);
  const gaps =
    analysis?.gaps ??
    (searchParams.get("gaps")?.split(",").map(s => s.trim()).filter(Boolean) ?? []);

  const deltaNum = Number.parseInt(delta, 10);
  const showStrongMatch = Number.isFinite(deltaNum) && deltaNum > 20;

  const sankeyData = analysis?.sankey;
  const radarData = analysis?.radar;
  const jobTechs = analysis?.job_techs ?? [];
  const resumeTechs = analysis?.resume_techs ?? [];
  const jobCaps = analysis?.job_caps ?? {};
  const resumeCaps = analysis?.resume_caps ?? {};
  const atsPriority = analysis?.ats_priority ?? [];
  const transferMap = analysis?.transfer_map ?? {};
  const riskFlags = analysis?.risk_flags ?? [];

  const overlapTechs = jobTechs.filter(tech => resumeTechs.includes(tech));
  const keywordOverlapPct =
    jobTechs.length > 0 ? Math.round((overlapTechs.length / jobTechs.length) * 100) : 0;

  const capabilityRows = CAPABILITY_AXES.map(axis => {
    const jobValue = jobCaps[axis] || 0;
    const resumeValue = resumeCaps[axis] || 0;
    const coverage = jobValue > 0 ? Math.round((Math.min(jobValue, resumeValue) / jobValue) * 100) : 0;
    return { axis, jobValue, resumeValue, coverage };
  }).filter(row => row.jobValue > 0 || row.resumeValue > 0);

  const totalRequiredCaps = capabilityRows.reduce((sum, row) => sum + row.jobValue, 0);
  const matchedCaps = capabilityRows.reduce((sum, row) => sum + Math.min(row.jobValue, row.resumeValue), 0);
  const capabilityOverlapPct =
    totalRequiredCaps > 0 ? Math.round((matchedCaps / totalRequiredCaps) * 100) : 0;

  const topStrengths = capabilityRows
    .filter(row => row.jobValue > 0)
    .sort((a, b) => b.coverage - a.coverage)
    .slice(0, 3);

  const topGaps = capabilityRows
    .filter(row => row.jobValue > row.resumeValue)
    .sort((a, b) => (b.jobValue - b.resumeValue) - (a.jobValue - a.resumeValue))
    .slice(0, 3);

  const adjustedCapability = useMemo(() => {
    const recencyMultiplier = 0.85 + (recencyWeight - 1) * 0.03;
    const depthMultiplier = 0.85 + (depthWeight - 1) * 0.03;
    return Math.min(100, Math.round(capabilityOverlapPct * recencyMultiplier * depthMultiplier));
  }, [capabilityOverlapPct, depthWeight, recencyWeight]);

  const fitTier =
    Number.isFinite(capabilityNum) && capabilityNum >= 75 && deltaNum >= 10
      ? "Strong"
      : Number.isFinite(capabilityNum) && capabilityNum >= 55
        ? "Medium"
        : "Stretch";

  const interviewTalkingPoints = gaps.slice(0, 4).map(gap => {
    const transfers = transferMap[gap]?.resume_techs ?? [];
    if (transfers.length > 0) {
      return `While I have not used ${gap} directly, I have hands-on experience with ${transfers.join(
        ", "
      )}, which covers the same core capabilities.`;
    }
    return `I have adjacent experience that maps to ${gap}'s capabilities and can ramp quickly.`;
  });

  const transferRows = gaps.slice(0, 6).map(gap => ({
    gap,
    transfers: transferMap[gap]?.resume_techs ?? []
  }));

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

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Role Fit Summary</h2>
              <p className="text-gray-600 mb-4">
                A quick narrative based on capability coverage vs keyword match.
              </p>
              <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
                <p className="text-sm text-gray-700">
                  Fit tier: <span className="font-semibold">{fitTier}</span>. Keyword match is{" "}
                  {Number.isFinite(keywordNum) ? `${keywordNum}%` : "0%"} while
                  capability coverage is{" "}
                  {Number.isFinite(capabilityNum) ? `${capabilityNum}%` : "0%"}. The delta is{" "}
                  {deltaNum >= 0 ? "+" : ""}
                  {deltaNum} points.
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Risk Flags</h2>
              <p className="text-gray-600 mb-4">
                Potential hard requirements detected in the job description.
              </p>
              {riskFlags.length > 0 ? (
                <ul className="text-sm text-gray-700 space-y-2">
                  {riskFlags.map(flag => (
                    <li key={flag} className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
                      {flag}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No obvious hard-requirement language detected.
                </p>
              )}
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Coverage Breakdown</h2>
              <p className="text-gray-600 mb-6">
                A quick report on keyword overlap and capability coverage.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm text-gray-500">Job technologies</div>
                  <div className="text-2xl font-bold text-slate-800">{jobTechs.length}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm text-gray-500">Resume technologies</div>
                  <div className="text-2xl font-bold text-slate-800">{resumeTechs.length}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm text-gray-500">Keyword overlap</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {overlapTechs.length} ({keywordOverlapPct}%)
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-sm text-gray-500">Capability overlap</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {matchedCaps}/{totalRequiredCaps} ({capabilityOverlapPct}%)
                  </div>
                </div>
              </div>

              {overlapTechs.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Exact keyword matches</p>
                  <div className="flex flex-wrap gap-2">
                    {overlapTechs.slice(0, 10).map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  No exact keyword matches found. Capability overlap may still be strong.
                </p>
              )}
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Capability Highlights</h2>
              <p className="text-gray-600 mb-6">
                Where your capabilities align best and where coverage is thin.
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Top aligned capabilities</p>
                  {topStrengths.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {topStrengths.map(row => (
                        <span
                          key={`strength-${row.axis}`}
                          className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                        >
                          {row.axis} {row.coverage}%
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Run an analysis to generate capability highlights.
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Largest capability gaps</p>
                  {topGaps.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {topGaps.map(row => (
                        <span
                          key={`gap-${row.axis}`}
                          className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium"
                        >
                          {row.axis} -{row.jobValue - row.resumeValue}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {capabilityRows.length === 0
                        ? "Run an analysis to surface capability gaps."
                        : "No major capability gaps detected for this role."}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">ATS Optimization Priority</h2>
            <p className="text-gray-600 mb-6">
              Missing keywords ranked by likely impact (frequency × capability weight).
            </p>
            {atsPriority.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atsPriority.slice(0, 8).map(item => (
                  <span
                    key={item.tech}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {item.tech} · score {item.score}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No missing keywords to prioritize.
              </p>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Transferable Skill Map</h2>
            <p className="text-gray-600 mb-6">
              Missing job technologies mapped to resume skills that share capabilities.
            </p>
            {transferRows.length > 0 ? (
              <div className="space-y-3">
                {transferRows.map(row => (
                  <div key={row.gap} className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                      {row.gap}
                    </span>
                    <span className="text-xs text-gray-400">→</span>
                    {row.transfers.length > 0 ? (
                      row.transfers.map(tech => (
                        <span
                          key={`${row.gap}-${tech}`}
                          className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No direct transfer found</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Run an analysis to generate a transfer map.
              </p>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Recency & Depth Simulator</h2>
            <p className="text-gray-600 mb-6">
              Adjust these sliders to estimate how recent and deep experience can shift coverage.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">Recency weight</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={recencyWeight}
                  onChange={event => setRecencyWeight(Number(event.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">Level {recencyWeight} of 5</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Depth weight</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={depthWeight}
                  onChange={event => setDepthWeight(Number(event.target.value))}
                  className="w-full mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">Level {depthWeight} of 5</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-gray-700">
              Adjusted capability coverage estimate: <span className="font-semibold">{adjustedCapability}%</span>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Interview Talking Points</h2>
            <p className="text-gray-600 mb-6">
              Suggested framing for the largest gaps.
            </p>
            {interviewTalkingPoints.length > 0 ? (
              <ul className="text-sm text-gray-700 space-y-3">
                {interviewTalkingPoints.map((point, index) => (
                  <li key={`${point}-${index}`} className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                    {point}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No gaps detected to generate talking points.
              </p>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Capability Coverage Table</h2>
            <p className="text-gray-600 mb-6">
              Full breakdown of job demand vs resume coverage by capability axis.
            </p>
            {capabilityRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2">Capability</th>
                      <th className="py-2">Job</th>
                      <th className="py-2">Resume</th>
                      <th className="py-2">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {capabilityRows.map(row => (
                      <tr key={row.axis} className="border-b last:border-b-0">
                        <td className="py-2 font-medium text-gray-700">{row.axis}</td>
                        <td className="py-2 text-gray-600">{row.jobValue}</td>
                        <td className="py-2 text-gray-600">{row.resumeValue}</td>
                        <td className="py-2 text-gray-600">{row.coverage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Run an analysis to populate the coverage table.
              </p>
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
