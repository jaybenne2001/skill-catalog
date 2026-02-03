import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const results = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText } = await req.json()
    
    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Mock data - replace with real Python backend
    const mockData = {
      keyword_match: 42,
      capability_match: 82,
      delta: 40,
      gaps: ['AWS', 'Go', 'Grafana', 'Kubernetes']
    }
    
    const id = nanoid()
    results.set(id, mockData)
    setTimeout(() => results.delete(id), 60 * 60 * 1000)
    
    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  const data = results.get(id)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  return NextResponse.json(data)
}
