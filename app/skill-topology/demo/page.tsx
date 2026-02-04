'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DemoResults() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href="/skill-topology">
            <Button variant="outline">← Back to Skill Topology</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">Demo Analysis Results</h1>
        <p className="text-center text-gray-600 mb-12">
          Example comparison: Senior Data Engineer resume vs Cloud AWS Engineer job posting
        </p>
        
        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center bg-red-50 border-red-200">
            <div className="text-6xl font-bold text-red-600 mb-3">33%</div>
            <div className="text-sm text-gray-600">Traditional ATS</div>
            <div className="text-xs text-gray-500 mt-2">Keyword Match</div>
          </Card>
          
          <Card className="p-8 text-center bg-green-50 border-green-200">
            <div className="text-6xl font-bold text-green-600 mb-3">85%</div>
            <div className="text-sm text-gray-600">Skill Topology</div>
            <div className="text-xs text-gray-500 mt-2">Capability Match</div>
          </Card>
          
          <Card className="p-8 text-center bg-blue-50 border-blue-200">
            <div className="text-6xl font-bold text-blue-600 mb-3">+52</div>
            <div className="text-sm text-gray-600">Hidden Value</div>
            <div className="text-xs text-gray-500 mt-2">Percentage Points</div>
          </Card>
        </div>

        {/* Interpretation */}
        <Card className="p-8 mb-12 bg-green-50 border-green-200">
          <h2 className="text-2xl font-bold mb-4">✅ What This Means</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Traditional ATS (33%):</strong> Only 4 out of 12 required technologies appear on the resume.
              Most ATS systems would reject this candidate.
            </p>
            <p>
              <strong>Skill Topology (85%):</strong> The candidate has experience in 7 out of 8 core capabilities 
              required by the job. Their Azure experience transfers to AWS, PostgreSQL transfers to MySQL, etc.
            </p>
            <p>
              <strong>Hidden Value (+52 points):</strong> This candidate is actually highly qualified but would be 
              filtered out by 52 percentage points in traditional keyword matching.
            </p>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="space-y-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Chart 1: Skill Consolidation Flow (Sankey Diagram)</h2>
            <p className="text-gray-600 mb-6">
              Shows how resume technologies map through root capabilities to job requirements.
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-12 aspect-video flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center max-w-xl">
                <div className="text-6xl mb-6">📊</div>
                <p className="text-xl font-bold text-gray-700 mb-4">Sankey Flow Diagram</p>
                <p className="text-gray-600 mb-2">14 Technologies → 8 Root Capabilities → 12 Job Requirements</p>
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Example insights:</strong> Python + SQL Server experience provides 
                    "Scripting Logic" and "Tabular Reasoning" capabilities, which satisfy 
                    requirements for Go, PostgreSQL, and data transformation tasks.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Chart 2: Capability Coverage (Radar Chart)</h2>
            <p className="text-gray-600 mb-6">
              Compares your capability strength across 8 core dimensions vs job requirements.
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-12 aspect-square max-w-2xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <p className="text-xl font-bold text-gray-700 mb-4">Radar Chart Comparison</p>
                <p className="text-gray-600 mb-4">85% Average Coverage Across 8 Capabilities</p>
                <div className="mt-6 p-4 bg-white rounded-lg text-left">
                  <p className="text-sm text-gray-600 mb-2"><strong>Strengths (≥90%):</strong></p>
                  <ul className="text-sm text-gray-600 mb-4 ml-4">
                    <li>• Scripting Logic: 100%</li>
                    <li>• Tabular Reasoning: 100%</li>
                    <li>• Cloud Storage: 95%</li>
                  </ul>
                  <p className="text-sm text-gray-600 mb-2"><strong>Gaps (&lt;60%):</strong></p>
                  <ul className="text-sm text-gray-600 ml-4">
                    <li>• Monitoring: 54%</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-orange-50 border-orange-200">
            <h2 className="text-2xl font-bold mb-4">Gap Analysis</h2>
            <p className="text-gray-600 mb-4">Technologies required by job but not explicitly on resume:</p>
            <div className="flex flex-wrap gap-3 mb-6">
              {['AWS', 'Kubernetes', 'Go', 'Grafana', 'MySQL', 'Terraform'].map(gap => (
                <span key={gap} className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                  {gap}
                </span>
              ))}
            </div>
            <div className="bg-white rounded-lg p-6">
              <p className="text-sm font-bold text-gray-700 mb-2">💡 Interview Strategy:</p>
              <p className="text-sm text-gray-600">
                "While I haven't used AWS specifically, I have 4 years of Azure experience covering the same 
                capabilities: cloud storage, container orchestration, and infrastructure as code. I've worked 
                extensively with PostgreSQL which uses identical patterns to MySQL. My monitoring experience 
                with Azure's tools transfers directly to Grafana."
              </p>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="mt-12 space-y-6">
          <Card className="p-8 bg-blue-50 border-blue-200 text-center">
            <h3 className="text-2xl font-bold mb-4">Try Your Own Analysis</h3>
            <p className="text-gray-600 mb-6">
              See how your resume matches against real job postings
            </p>
            <Link href="/skill-topology/analyze">
              <Button size="lg" className="text-lg">
                Analyze Your Skills →
              </Button>
            </Link>
          </Card>

          <Card className="p-6 bg-gray-50 border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Note:</strong> Live chart generation requires Lambda backend deployment. 
              See <code className="bg-white px-2 py-1 rounded text-xs">lambda-skill-topology/DEPLOY.md</code> for setup instructions.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
