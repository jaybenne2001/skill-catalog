import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SkillTopology() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Skill Topology
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            A capability-based approach to skill matching
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Maps technologies to root capabilities to reveal transferable skills
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/skill-topology/demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo Example
              </Button>
            </Link>
            <Link href="/skill-topology/analyze">
              <Button size="lg" className="text-lg px-8">
                Analyze Your Skills →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Methodology</h2>
            
            <div className="space-y-8">
              <Card className="p-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Map to Root Capabilities</h3>
                    <p className="text-gray-600">
                      Technologies are mapped to fundamental capabilities. Python and Go both require 
                      scripting logic. Azure and AWS both involve cloud storage patterns.
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
                    <p className="text-gray-600">
                      Capability overlap is measured using weighted graph analysis. Experience depth 
                      and recency are factored into transfer probability.
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
                    <h3 className="text-2xl font-bold mb-3">Visualize Flow</h3>
                    <p className="text-gray-600">
                      Sankey diagrams show skill flow from resume experience through capabilities 
                      to job requirements, making transfer paths explicit.
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
