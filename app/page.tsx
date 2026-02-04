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
            Data Engineer & Product Builder
          </p>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Portfolio projects and technical demonstrations
          </p>
          <Link href="/skill-topology">
            <Button size="lg" className="text-xl px-12 py-6">
              View Skill Topology Demo →
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-3">Skill Topology</h3>
              <p className="text-gray-600">
                Capability-based skill matching using graph analysis and visual flow diagrams
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Data Engineering</h3>
              <p className="text-gray-600">
                Snowflake, Databricks, Azure - production ETL pipelines and warehouse implementations
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Automation</h3>
              <p className="text-gray-600">
                Python + GPT integration achieving 70% efficiency improvements on enterprise projects
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Recent Work</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">TN CCWIS - Deloitte</h3>
              <p className="text-gray-600">
                Snowflake data warehouse development with AI-assisted metadata parsing for 
                Tennessee's child welfare system modernization
              </p>
            </Card>
            
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">FedEx DataWorks - Deloitte</h3>
              <p className="text-gray-600">
                Oracle to Databricks migration using Medallion architecture with PySpark transformations
              </p>
            </Card>
            
            <Card className="p-6 text-left">
              <h3 className="text-xl font-bold mb-2">CaseBuildr - xBrezzo</h3>
              <p className="text-gray-600">
                Multi-tenant family law platform with document management and AI categorization
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
