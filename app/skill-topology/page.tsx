import Image from "next/image"
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
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card className="p-8 shadow-2xl">
              <Image 
                src="/images/demo-sankey.png" 
                alt="Skill Topology Visualization"
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
            <Card className="p-8 text-center bg-gray-50">
              <div className="text-5xl font-bold text-gray-700 mb-3">42%</div>
              <div className="text-sm text-gray-600">Keyword Match</div>
            </Card>
            <Card className="p-8 text-center bg-green-50 border-green-200">
              <div className="text-5xl font-bold text-green-600 mb-3">82%</div>
              <div className="text-sm text-gray-600">Capability Match</div>
            </Card>
            <Card className="p-8 text-center bg-blue-50 border-blue-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">+40</div>
              <div className="text-sm text-gray-600">Point Difference</div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <Link href="/skill-topology/analyze">
          <Button size="lg" className="text-xl px-12 py-8">
            Try the Demo →
          </Button>
        </Link>
      </section>

      <section className="py-20 bg-gray-50">
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
