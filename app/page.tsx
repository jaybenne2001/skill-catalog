import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">Jay Bennett</h1>
          <p className="text-2xl text-gray-600 mb-4">
            AI-Native Product Engineer
          </p>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Building production applications 10x faster by operating at the architecture layer
          </p>
          <Link href="/skill-topology">
            <Button size="lg" className="text-xl px-12 py-6">
              See Skill Topology Demo →
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">What Makes This Different</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Capability-Based</h3>
              <p className="text-gray-600">
                Maps 25+ technologies to 8 root capabilities, showing true skill transfer
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Visual Proof</h3>
              <p className="text-gray-600">
                Sankey diagrams show exactly how skills flow from experience to requirements
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Hidden Value</h3>
              <p className="text-gray-600">
                Reveals 30%+ capability match that traditional keyword ATS systems miss
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Experience Highlights</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">70% Efficiency Gains</h3>
              <p className="text-gray-600">
                Built AI-powered Python automation at Deloitte achieving 70% efficiency improvements 
                in government data pipelines (TN CCWIS project)
              </p>
            </Card>
            
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">Multi-Tenant SaaS Architecture</h3>
              <p className="text-gray-600">
                Designed CaseBuildr family law platform with RBAC, AI document processing, 
                and Teams integration ($8k/month contract)
              </p>
            </Card>
            
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">15+ Years Data Engineering</h3>
              <p className="text-gray-600">
                Snowflake, Databricks, Azure, AWS - enterprise-scale ETL pipelines and 
                data warehouse implementations
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
