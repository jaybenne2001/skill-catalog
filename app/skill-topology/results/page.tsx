"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RadarData, SankeyData } from "@/lib/skill-matcher";
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
