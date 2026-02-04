'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function Analyze() {
  const [jobDescription, setJobDescription] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [useUrl, setUseUrl] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription: useUrl ? jobUrl : jobDescription,
          resumeText,
          isUrl: useUrl
        })
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      router.push(`/skill-topology/results/${data.id}`)
    } catch (error) {
      alert('Analysis failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold mb-4 text-center">Analyze Match Quality</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Compare keyword matching vs capability-based analysis
        </p>
        
        <Card className="p-8 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Job Description</h2>
          
          {/* Toggle between URL and Text */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUseUrl(false)}
              className={`px-4 py-2 rounded ${!useUrl ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setUseUrl(true)}
              className={`px-4 py-2 rounded ${useUrl ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Provide URL
            </button>
          </div>

          {useUrl ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Enter the URL of the job posting (LinkedIn, Indeed, company careers page, etc.)
              </p>
              <input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base font-mono"
              />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Paste the job posting. Include required technologies.
              </p>
              <Textarea 
                placeholder="Example:
Senior Cloud Engineer with:
• Python, Go, or NodeJS
• AWS or Azure
• Docker and Kubernetes
• CI/CD with GitLab
• Monitoring with Grafana"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                className="text-base font-mono"
              />
            </>
          )}
        </Card>

        <Card className="p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Resume</h2>
          <p className="text-sm text-gray-600 mb-4">
            Paste resume text with years of experience per technology.
          </p>
          <Textarea 
            placeholder="Example:
Senior Data Engineer - 15 years experience

Skills:
• Python (15y) - AI automation, ETL
• Azure (4y, Certified)
• SQL Server (12y)
• Docker (3y)
• Terraform (2y)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={15}
            className="text-base font-mono"
          />
        </Card>

        <Button 
          onClick={handleAnalyze}
          disabled={loading || (!jobDescription.trim() && !jobUrl.trim()) || !resumeText.trim()}
          size="lg"
          className="w-full text-lg py-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Analyzing... (30 seconds)
            </span>
          ) : (
            'Analyze Match Quality →'
          )}
        </Button>
      </div>
    </div>
  )
}
