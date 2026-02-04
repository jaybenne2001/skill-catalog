'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Analyze() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [jobMode, setJobMode] = useState<'text' | 'url'>('text')
  const [resumeMode, setResumeMode] = useState<'text' | 'file' | 'linkedin'>('text')
  
  const [jobText, setJobText] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setError('')
    setLoading(true)

    try {
      let finalJobText = jobText
      let finalResumeText = resumeText

      // Fetch job description from URL if needed
      if (jobMode === 'url' && jobUrl) {
        finalJobText = jobText || 'Job description from URL'
      }

      // Handle resume input
      if (resumeMode === 'linkedin' && linkedinUrl) {
        const response = await fetch('/api/scrape-linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: linkedinUrl })
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to fetch LinkedIn profile')
        }
        
        const data = await response.json()
        finalResumeText = data.text
      } else if (resumeMode === 'file' && uploadedFile) {
        finalResumeText = await uploadedFile.text()
      }

      if (!finalJobText || !finalResumeText) {
        setError('Please provide both job description and resume')
        setLoading(false)
        return
      }

      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: finalJobText,
          resumeText: finalResumeText,
          isUrl: false
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results = await response.json()
      
      console.log('Analysis results:', results)

      // Check if we have valid results
      if (typeof results.keyword_match === 'undefined' || 
          typeof results.capability_match === 'undefined') {
        throw new Error('Invalid response from analysis API')
      }

      // Navigate to results with query params
      const params = new URLSearchParams({
        keyword: results.keyword_match.toString(),
        capability: results.capability_match.toString(),
        delta: results.delta.toString(),
        gaps: (results.gaps || []).join(',')
      })

      router.push(`/skill-topology/results?${params.toString()}`)
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.message || 'Failed to analyze. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/skill-topology">
            <Button variant="outline">← Back</Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center">Analyze Match Quality</h1>
        <p className="text-center text-gray-600 mb-12">
          Compare keyword matching vs capability-based analysis
        </p>

        <div className="space-y-8">
          {/* Job Description */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            
            <div className="flex gap-2 mb-4">
              <Button
                variant={jobMode === 'text' ? 'default' : 'outline'}
                onClick={() => setJobMode('text')}
              >
                Paste Text
              </Button>
              <Button
                variant={jobMode === 'url' ? 'default' : 'outline'}
                onClick={() => setJobMode('url')}
              >
                Provide URL
              </Button>
            </div>

            {jobMode === 'text' ? (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Paste the job posting. Include required technologies.
                </p>
                <Textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Senior Data Engineer

Requirements:
- Python and SQL
- AWS or Azure
- Spark and Airflow
- Docker/Kubernetes experience preferred"
                  rows={12}
                  className="font-mono text-sm"
                />
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Enter job posting URL (LinkedIn, Indeed, company careers page)
                </p>
                <Input
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  className="mb-4"
                />
                <Textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Or paste job text here..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </>
            )}
          </Card>

          {/* Resume */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Resume</h2>
            
            <div className="flex gap-2 mb-4">
              <Button
                variant={resumeMode === 'text' ? 'default' : 'outline'}
                onClick={() => setResumeMode('text')}
              >
                Paste Text
              </Button>
              <Button
                variant={resumeMode === 'linkedin' ? 'default' : 'outline'}
                onClick={() => setResumeMode('linkedin')}
              >
                LinkedIn URL
              </Button>
              <Button
                variant={resumeMode === 'file' ? 'default' : 'outline'}
                onClick={() => setResumeMode('file')}
              >
                Upload File
              </Button>
            </div>

            {resumeMode === 'text' && (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Paste resume text or professional summary
                </p>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Data Engineer with 10 years experience

Skills: Python, SQL, Snowflake, PostgreSQL, Docker, Git"
                  rows={12}
                  className="font-mono text-sm"
                />
              </>
            )}

            {resumeMode === 'linkedin' && (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Enter your LinkedIn profile URL (must be public)
                </p>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Note: LinkedIn may block automated requests. If this fails, copy your profile text instead.
                </p>
              </>
            )}

            {resumeMode === 'file' && (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Upload resume (.txt, .pdf, .docx, .md)
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    accept=".txt,.pdf,.doc,.docx,.md"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div>
                        <p className="text-lg font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                        <Button variant="link" className="mt-2">
                          Click to change file
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-gray-600">Click to upload resume</p>
                      </div>
                    )}
                  </label>
                </div>
              </>
            )}
          </Card>

          {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            size="lg"
            className="w-full text-lg"
          >
            {loading ? 'Analyzing...' : 'Analyze Match Quality →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
