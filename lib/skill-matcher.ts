/**
 * Client-side skill matching logic
 * Same algorithm as Python backend but runs in browser
 */

interface CapabilityMap {
  [key: string]: string[]
}

const CAPABILITY_MAP: CapabilityMap = {
  // Cloud & Infrastructure
  'AWS': ['Cloud Storage', 'Orchestration', 'Distributed Exec'],
  'AZURE': ['Cloud Storage', 'Orchestration', 'Distributed Exec'],
  'GCP': ['Cloud Storage', 'Orchestration', 'Distributed Exec'],
  'DOCKER': ['Orchestration', 'Transform Logic'],
  'KUBERNETES': ['Orchestration', 'Distributed Exec'],
  'TERRAFORM': ['Orchestration', 'Transform Logic'],
  
  // Programming Languages
  'PYTHON': ['Scripting Logic', 'Transform Logic'],
  'JAVA': ['Scripting Logic', 'Transform Logic'],
  'JAVASCRIPT': ['Scripting Logic', 'Transform Logic'],
  'TYPESCRIPT': ['Scripting Logic', 'Transform Logic'],
  'GO': ['Scripting Logic', 'Cloud Storage'],
  'C#': ['Scripting Logic', 'Transform Logic'],
  'RUBY': ['Scripting Logic', 'Transform Logic'],
  'PHP': ['Scripting Logic', 'Transform Logic'],
  
  // Databases
  'SQL': ['Tabular Reasoning', 'Cloud Storage'],
  'POSTGRESQL': ['Tabular Reasoning', 'Cloud Storage'],
  'MYSQL': ['Tabular Reasoning', 'Cloud Storage'],
  'MONGODB': ['Cloud Storage', 'Transform Logic'],
  'REDIS': ['Cloud Storage'],
  'SNOWFLAKE': ['Tabular Reasoning', 'Cloud Storage'],
  'DATABRICKS': ['Tabular Reasoning', 'Cloud Storage', 'Distributed Exec'],
  
  // Data Engineering
  'SPARK': ['Distributed Exec', 'Transform Logic'],
  'AIRFLOW': ['Orchestration', 'Transform Logic'],
  'KAFKA': ['Distributed Exec', 'Cloud Storage'],
  'ETL': ['Transform Logic', 'Tabular Reasoning'],
  
  // Monitoring & Observability
  'GRAFANA': ['Monitoring'],
  'PROMETHEUS': ['Monitoring'],
  'DATADOG': ['Monitoring'],
  'CLOUDWATCH': ['Monitoring', 'Cloud Storage'],
  
  // Version Control & CI/CD
  'GIT': ['Governance'],
  'GITHUB': ['Governance'],
  'GITLAB': ['Governance', 'Orchestration'],
  'JENKINS': ['Orchestration'],
  'CIRCLECI': ['Orchestration'],
  
  // Web Frameworks
  'REACT': ['Scripting Logic', 'Transform Logic'],
  'ANGULAR': ['Scripting Logic', 'Transform Logic'],
  'VUE': ['Scripting Logic', 'Transform Logic'],
  'DJANGO': ['Scripting Logic', 'Transform Logic'],
  'FLASK': ['Scripting Logic', 'Transform Logic'],
  'NODE': ['Scripting Logic', 'Transform Logic'],
  'NODEJS': ['Scripting Logic', 'Transform Logic'],
  
  // BI Tools
  'POWERBI': ['Tabular Reasoning', 'Monitoring'],
  'POWER BI': ['Tabular Reasoning', 'Monitoring'],
  'TABLEAU': ['Tabular Reasoning', 'Monitoring'],
  'LOOKER': ['Tabular Reasoning', 'Monitoring'],
  
  // Additional common technologies
  'SSIS': ['Transform Logic', 'Orchestration'],
  'PANDAS': ['Tabular Reasoning', 'Transform Logic'],
  'NUMPY': ['Transform Logic'],
  'SALESFORCE': ['Cloud Storage', 'Governance'],
}

function parseText(text: string): string[] {
  const textUpper = text.toUpperCase()
  const found: Set<string> = new Set()
  
  for (const tech of Object.keys(CAPABILITY_MAP)) {
    const pattern = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    if (pattern.test(textUpper)) {
      found.add(tech)
    }
  }
  
  return Array.from(found)
}

function getCapabilities(techs: string[]): Record<string, number> {
  const capabilities: Record<string, number> = {}
  
  for (const tech of techs) {
    if (CAPABILITY_MAP[tech]) {
      for (const cap of CAPABILITY_MAP[tech]) {
        capabilities[cap] = (capabilities[cap] || 0) + 1
      }
    }
  }
  
  return capabilities
}

export function analyzeMatch(jobDescription: string, resumeText: string) {
  // Parse technologies from both texts
  const jobTechs = parseText(jobDescription)
  const resumeTechs = parseText(resumeText)
  
  // Calculate keyword match
  const jobSet = new Set(jobTechs)
  const resumeSet = new Set(resumeTechs)
  const keywordMatches = jobTechs.filter(tech => resumeSet.has(tech)).length
  const keywordMatch = jobTechs.length > 0 ? Math.round((keywordMatches / jobTechs.length) * 100) : 0
  
  // Calculate capability match
  const resumeCaps = getCapabilities(resumeTechs)
  const jobCaps = getCapabilities(jobTechs)
  
  const resumeCapSet = new Set(Object.keys(resumeCaps))
  const jobCapSet = new Set(Object.keys(jobCaps))
  const capabilityMatches = Array.from(jobCapSet).filter(cap => resumeCapSet.has(cap)).length
  const capabilityMatch = jobCapSet.size > 0 ? Math.round((capabilityMatches / jobCapSet.size) * 100) : 0
  
  // Calculate delta
  const delta = capabilityMatch - keywordMatch
  
  // Find gaps
  const gaps = jobTechs.filter(tech => !resumeSet.has(tech))
  
  return {
    keyword_match: keywordMatch,
    capability_match: capabilityMatch,
    delta,
    gaps,
    job_techs: jobTechs,
    resume_techs: resumeTechs,
    job_caps: Object.keys(jobCaps),
    resume_caps: Object.keys(resumeCaps)
  }
}
