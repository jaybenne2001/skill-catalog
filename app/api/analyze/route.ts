import { NextRequest, NextResponse } from 'next/server';

const LAMBDA_ENDPOINT = 'https://1k8m52a28i.execute-api.us-east-1.amazonaws.com/default/skill-topology-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills, jobDescription } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Skills array is required' },
        { status: 400 }
      );
    }

    // Call Lambda function
    const lambdaResponse = await fetch(LAMBDA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: skills,
        job_description: jobDescription || ''
      }),
    });

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text();
      console.error('Lambda error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate charts from Lambda' },
        { status: 500 }
      );
    }

    const lambdaData = await lambdaResponse.json();

    return NextResponse.json({
      success: true,
      sankey_chart: lambdaData.sankey_chart,
      radar_chart: lambdaData.radar_chart,
      skill_mapping: lambdaData.skill_mapping
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    );
  }
}