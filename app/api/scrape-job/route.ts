import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid job URL required' },
        { status: 400 }
      )
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch job posting. The site may be blocking requests.' },
        { status: 500 }
      )
    }

    const html = await response.text()
    const extractedText = extractJobContent(html)

    return NextResponse.json({
      text: extractedText,
      source: 'job-url'
    })
  } catch (error) {
    console.error('Job scrape error:', error)
    return NextResponse.json(
      { error: 'Failed to process job posting. Try pasting the job text instead.' },
      { status: 500 }
    )
  }
}

function extractJobContent(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/\s+/g, ' ').trim()

  const sections = []
  const requirementsMatch = text.match(/Requirements.{0,5000}/i)
  const qualificationsMatch = text.match(/Qualifications.{0,5000}/i)
  const responsibilitiesMatch = text.match(/Responsibilities.{0,5000}/i)
  const skillsMatch = text.match(/Skills.{0,3000}/i)

  if (responsibilitiesMatch) sections.push(responsibilitiesMatch[0])
  if (requirementsMatch) sections.push(requirementsMatch[0])
  if (qualificationsMatch) sections.push(qualificationsMatch[0])
  if (skillsMatch) sections.push(skillsMatch[0])

  const condensed = sections.length > 0 ? sections.join('\n\n') : text
  return condensed.slice(0, 6000)
}
