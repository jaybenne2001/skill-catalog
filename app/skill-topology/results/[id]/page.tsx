'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Results() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/analyze?id=${params?.id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <div className="text-2xl font-bold">Loading results...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl font-bold mb-4">Results not found</div>
          <Link href="/skill-topology/analyze">
            <Button size="lg">Try Again</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center">Analysis Results</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          <Card className="p-10 text-center bg-red-50 border-2 border-red-200 shadow-lg">
            <div className="text-sm font-medium text-gray-600 mb-3">Traditional ATS</div>
            <div className="text-7xl font-bold text-red-600 mb-3">{data.keyword_match}%</div>
            <div className="text-xs text-gray-500">Keyword Match</div>
          </Card>
          
          <Card className="p-10 text-center bg-green-50 border-2 border-green-200 shadow-lg">
            <div className="text-sm font-medium text-gray-600 mb-3">Skill Topology</div>
            <div className="text-7xl font-bold text-green-600 mb-3">{data.capability_match}%</div>
            <div className="text-xs text-gray-500">Capability Match</div>
          </Card>
          
          <Card className="p-10 text-center bg-blue-50 border-2 border-blue-200 shadow-lg">
            <div className="text-sm font-medium text-gray-600 mb-3">Hidden Value</div>
            <div className="text-7xl font-bold text-blue-600 mb-3">+{data.delta}</div>
            <div className="text-xs text-gray-500">Percentage Points</div>
          </Card>
        </div>

        {data.gaps && data.gaps.length > 0 && (
          <Card className="p-8 max-w-5xl mx-auto shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">Gap Analysis</h2>
            <p className="mb-4 text-gray-600">
              Technologies required by job but not on resume:
            </p>
            <div className="flex flex-wrap gap-3">
              {data.gaps.map((gap: string) => (
                <span key={gap} className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
                  {gap}
                </span>
              ))}
            </div>
          </Card>
        )}

        <div className="text-center space-x-4">
          <Link href="/skill-topology/analyze">
            <Button size="lg">Analyze Another →</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
