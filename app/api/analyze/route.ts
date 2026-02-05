import { NextRequest, NextResponse } from 'next/server';

const LAMBDA_ENDPOINT = 'https://1k8m52a28i.execute-api.us-east-1.amazonaws.com/default/skill-topology-analyzer';

// Simple skill extraction - matches common tech terms
function extractSkills(text: string): string[] {
  const commonSkills = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'PHP',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Snowflake', 'BigQuery',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins',
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI',
    'Spark', 'Airflow', 'Kafka', 'Databricks', 'ETL', 'Git', 'CI/CD',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'REST API', 'GraphQL', 'Microservices', 'Lambda', 'S3', 'SSIS'
  ];
  
  const skills: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

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

    // Extract skills from resume
    const skills = extractSkills(resumeText);

    if (skills.length === 0) {
      return NextResponse.json(
        { error: 'No recognizable skills found in resume' },
        { status: 400 }
      );
    }

    console.log('Extracted skills:', skills);

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

    // Calculate match percentages (simple keyword matching for now)
    const jobSkills = jobDescription ? extractSkills(jobDescription) : [];
    const matchedSkills = skills.filter(s => 
      jobSkills.some(js => js.toLowerCase() === s.toLowerCase())
    );
    
    const keywordMatch = jobSkills.length > 0 
        ? Math.round((matchedSkills.length / jobSkills.length) * 100)
        : 0;

      return NextResponse.json({
        success: true,
        sankey_chart: lambdaData.sankey_chart,
        radar_chart: lambdaData.radar_chart,
        skill_mapping: lambdaData.skill_mapping,
        keyword_match: keywordMatch,
        capability_match: 85, // Placeholder
        delta: 85 - keywordMatch,
        gaps: jobSkills.filter(js => !matchedSkills.includes(js))
      });

    } catch (error) {
      console.error('Analysis error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze skills' },
        { status: 500 }
      );
    }
  }