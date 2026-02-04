"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ResultsContent() {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "0";
  const capability = searchParams.get("capability") ?? "0";
  const delta = searchParams.get("delta") ?? "0";
  const gaps =
    searchParams.get("gaps")?.split(",").map(s => s.trim()).filter(Boolean) ?? [];

  const deltaNum = Number.parseInt(delta, 10);
  const showStrongMatch = Number.isFinite(deltaNum) && deltaNum > 20;

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
            <h2 className="text-2xl font-bold mb-4">✅ Strong Capability Match!</h2>
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

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-12 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center max-w-xl">
                <div className="text-6xl mb-6">📊</div>
                <p className="text-xl font-bold text-gray-700 mb-4">
                  Sankey Visualization
                </p>
                <p className="text-gray-600 mb-4">
                  Deploy Lambda backend to see flow diagram
                </p>
                <p className="text-sm text-gray-500">
                  See lambda-skill-topology/DEPLOY.md for instructions
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              Capability Coverage (Radar Chart)
            </h2>
            <p className="text-gray-600 mb-6">
              Compares your capability strength across 8 core dimensions vs job
              requirements.
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-12 aspect-square max-w-2xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <p className="text-xl font-bold text-gray-700 mb-4">
                  Radar Chart Analysis
                </p>
                <p className="text-gray-600 mb-4">{capability}% Average Coverage</p>
                <p className="text-sm text-gray-500">
                  Deploy Lambda backend to see detailed breakdown
                </p>
              </div>
            </div>
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
                  💡 Interview Strategy:
                </p>
                <p className="text-sm text-gray-600">
                  Focus on your transferable capabilities. For example: "While I
                  haven&apos;t used [missing tech] specifically, I have extensive
                  experience with similar tools that provide the same
                  capabilities..."
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/skill-topology/analyze">
           