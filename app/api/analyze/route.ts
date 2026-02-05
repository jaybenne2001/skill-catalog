import { NextRequest, NextResponse } from 'next/server';
import { analyzeMatch } from '@/lib/skill-matcher';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const analysis = analyzeMatch(jobDescription || '', resumeText);

    if (analysis.resume_techs.length === 0) {
      return NextResponse.json(
        { error: 'No recognizable skills found in resume' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      keyword_match: analysis.keyword_match,
      capability_match: analysis.capability_match,
      delta: analysis.delta,
      gaps: analysis.gaps,
      sankey: analysis.sankey,
      radar: analysis.radar,
      job_techs: analysis.job_techs,
      resume_techs: analysis.resume_techs,
      job_tech_counts: analysis.job_tech_counts,
      resume_tech_counts: analysis.resume_tech_counts,
      ats_priority: analysis.ats_priority,
      transfer_map: analysis.transfer_map,
      risk_flags: analysis.risk_flags,
      job_caps: analysis.job_caps,
      resume_caps: analysis.resume_caps
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    );
  }
}
