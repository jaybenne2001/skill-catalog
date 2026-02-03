import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SkillTopology() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stop Rejecting Qualified Candidates
          </h1>
          <p className="text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Traditional ATS systems miss 30%+ of qualified candidates
          </p>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            They focus on keyword matches instead of capability overlap
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 shadow-2xl">
              <Image 
                src="/images/demo-sankey.png" 
                alt="Skill Topology Visualization showing capability flow"
                width={1200}
                height={700}
                className="rounded-lg w-full"
                priority
              />
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-red-50 border-2 border-red-200">
              <div className="text-5xl font-bold text-red-600 mb-3">42%</div>
              <div className="text-sm font-medium text-gray-600">Traditional ATS</div>
              <div className="text-xs text-gray-500 mt-2">Keyword matching</div>
            </Card>
            <Card className="p-8 text-center bg-green-50 border-2 border-green-200">
              <div className="text-5xl font-bold text-green-600 mb-3">82%</div>
              <div className="text-sm font-medium text-gray-600">Capability Match</div>
              <div className="text-xs text-gray-500 mt-2">Skill Topology</div>
            </Card>
            <Card className="p-8 text-center bg-blue-50 border-2 border-blue-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">+40</div>
              <div className="text-sm font-medium text-gray-600">Hidden Value</div>
              <div className="text-xs text-gray-500 mt-2">Percentage points</div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <Link href="/skill-topology/analyze">
          <Button size="lg" className="text-xl px-12 py-8 rounded-full shadow-lg">
            Try It Free →
          </Button>
        </Link>
        <p className="text-sm text-gray-500 mt-4">No signup required • Results in 30 seconds</p>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
            
            <div className="space-y-8">
              <Card className="p-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Map to Root Capabilities</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Python and Go both require "Scripting Logic." Azure and AWS both need "Cloud Storage." 
                      Different tools, same fundamental capabilities.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Calculate Overlap</h3>
                    <p className="text-gray-600 leading-relaxed">
                      A Python expert can learn Go in 2 weeks because they already have scripting logic capability. 
                      Traditional ATS sees "no Go experience" and rejects.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Visualize Match Quality</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Sankey diagram shows exactly how skills flow: resume → capabilities → job requirements. 
                      Makes capability transfer obvious and defensible.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
