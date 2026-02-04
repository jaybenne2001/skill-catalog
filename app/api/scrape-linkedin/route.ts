import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || !url.includes('linkedin.com')) {
      return NextResponse.json(
        { error: 'Valid LinkedIn URL required' },
        { status: 400 }
      )
    }
    
    // Fetch the LinkedIn page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn profile. LinkedIn may be blocking requests.' },
        { status: 500 }
      )
    }
    
    const html = await response.text()
    const extractedText = extractLinkedInContent(html)
    
    return NextResponse.json({
      text: extractedText,
      source: 'linkedin'
    })
  } catch (error) {
    console.error('LinkedIn scraping error:', error)
    return NextResponse.json(
      { error: 'Failed to process LinkedIn profile. Try copying your profile text instead.' },
      { status: 500 }
    )
  }
}

function extractLinkedInContent(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/\s+/g, ' ').trim()
  
  const sections = []
  const experienceMatch = text.match(/Experience.{0,5000}/i)
  const skillsMatch = text.match(/Skills.{0,2000}/i)
  const educationMatch = text.match(/Education.{0,2000}/i)
  
  if (experienceMatch) sections.push(experienceMatch[0])
  if (skillsMatch) sections.push(skillsMatch[0])
  if (educationMatch) sections.push(educationMatch[0])
  
  return sections.length > 0 ? sections.join('\n\n') : text.slice(0, 5000)
}
