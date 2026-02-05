/**
 * Skill matching logic shared by client and server.
 */

export interface CapabilityMap {
  [key: string]: string[]
}

export const CAPABILITY_MAP: CapabilityMap = {
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

export const CAPABILITY_AXES = [
  'Scripting Logic',
  'Transform Logic',
  'Tabular Reasoning',
  'Cloud Storage',
  'Distributed Exec',
  'Orchestration',
  'Monitoring',
  'Governance',
]

export type SankeyNodeGroup = 'resume' | 'capability' | 'job'

export interface SankeyNode {
  id: string
  label: string
  group: SankeyNodeGroup
  value: number
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

export interface RadarData {
  categories: string[]
  resume: number[]
  job: number[]
}

export function extractTechs(text: string): string[] {
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

export function extractTechCounts(text: string): Record<string, number> {
  const textUpper = text.toUpperCase()
  const counts: Record<string, number> = {}

  for (const tech of Object.keys(CAPABILITY_MAP)) {
    const pattern = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    const matches = textUpper.match(pattern)
    if (matches && matches.length > 0) {
      counts[tech] = matches.length
    }
  }

  return counts
}

export function getCapabilities(techs: string[]): Record<string, number> {
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

function sumValues(record: Record<string, number>, keys: string[]): number {
  return keys.reduce((total, key) => total + (record[key] || 0), 0)
}

function buildSankeyData(resumeTechs: string[], jobTechs: string[]): SankeyData {
  const links: SankeyLink[] = []
  const values = new Map<string, number>()

  const addValue = (id: string, value: number) => {
    values.set(id, (values.get(id) || 0) + value)
  }

  for (const tech of resumeTechs) {
    const caps = CAPABILITY_MAP[tech] || []
    for (const cap of caps) {
      const source = `resume:${tech}`
      const target = `capability:${cap}`
      links.push({ source, target, value: 1 })
      addValue(source, 1)
      addValue(target, 1)
    }
  }

  for (const tech of jobTechs) {
    const caps = CAPABILITY_MAP[tech] || []
    for (const cap of caps) {
      const source = `capability:${cap}`
      const target = `job:${tech}`
      links.push({ source, target, value: 1 })
      addValue(source, 1)
      addValue(target, 1)
    }
  }

  const nodes: SankeyNode[] = Array.from(values.entries()).map(([id, value]) => {
    const [groupRaw, label] = id.split(':')
    const group = groupRaw as SankeyNodeGroup
    return { id, label, group, value }
  })

  return { nodes, links }
}

function buildRadarData(jobCaps: Record<string, number>, resumeCaps: Record<string, number>): RadarData {
  const categories = CAPABILITY_AXES
  const resume: number[] = []
  const job: number[] = []

  for (const axis of categories) {
    const resumeCount = resumeCaps[axis] || 0
    const jobCount = jobCaps[axis] || 0
    const maxCount = Math.max(1, resumeCount, jobCount)
    resume.push(Math.round((resumeCount / maxCount) * 100))
    job.push(Math.round((jobCount / maxCount) * 100))
  }

  return { categories, resume, job }
}

export function analyzeMatch(jobDescription: string, resumeText: string) {
  // Parse technologies from both texts
  const jobTechs = extractTechs(jobDescription)
  const resumeTechs = extractTechs(resumeText)
  const jobTechCounts = extractTechCounts(jobDescription)
  const resumeTechCounts = extractTechCounts(resumeText)
  
  // Calculate keyword match
  const jobSet = new Set(jobTechs)
  const resumeSet = new Set(resumeTechs)
  const keywordMatches = jobTechs.filter(tech => resumeSet.has(tech)).length
  const keywordMatch = jobTechs.length > 0 ? Math.round((keywordMatches / jobTechs.length) * 100) : 0
  
  // Calculate capability match
  const resumeCaps = getCapabilities(resumeTechs)
  const jobCaps = getCapabilities(jobTechs)
  
  const totalRequired = sumValues(jobCaps, CAPABILITY_AXES)
  const matched = CAPABILITY_AXES.reduce(
    (total, axis) => total + Math.min(jobCaps[axis] || 0, resumeCaps[axis] || 0),
    0
  )
  const capabilityMatch = totalRequired > 0 ? Math.round((matched / totalRequired) * 100) : 0
  
  // Calculate delta
  const delta = capabilityMatch - keywordMatch
  
  // Find gaps
  const gaps = jobTechs.filter(tech => !resumeSet.has(tech))

  const atsPriority = gaps.map(tech => {
    const occurrences = jobTechCounts[tech] || 1
    const capabilityWeight = CAPABILITY_MAP[tech]?.length || 1
    return {
      tech,
      occurrences,
      capability_weight: capabilityWeight,
      score: occurrences * capabilityWeight
    }
  }).sort((a, b) => b.score - a.score)

  const transferMap: Record<string, { resume_techs: string[]; shared_caps: string[] }> = {}
  for (const missingTech of gaps) {
    const missingCaps = CAPABILITY_MAP[missingTech] || []
    const resumeMatches: { tech: string; shared: string[] }[] = []
    for (const resumeTech of resumeTechs) {
      const resumeCaps = CAPABILITY_MAP[resumeTech] || []
      const shared = missingCaps.filter(cap => resumeCaps.includes(cap))
      if (shared.length > 0) {
        resumeMatches.push({ tech: resumeTech, shared })
      }
    }
    resumeMatches.sort((a, b) => b.shared.length - a.shared.length)
    transferMap[missingTech] = {
      resume_techs: resumeMatches.map(match => match.tech).slice(0, 4),
      shared_caps: missingCaps
    }
  }

  const jobTextLower = jobDescription.toLowerCase()
  const riskFlags: string[] = []
  const maybePush = (flag: string, patterns: RegExp[]) => {
    if (patterns.some(pattern => pattern.test(jobTextLower))) {
      riskFlags.push(flag)
    }
  }

  maybePush('Hard requirement language detected', [/\bmust have\b/, /\brequired\b/, /\brequirements?\b/])
  maybePush('Certification requirement', [/\bcertification\b/, /\bcertified\b/])
  maybePush('Security clearance or citizenship requirement', [/\bclearance\b/, /\bcitizenship\b/, /\bwork authorization\b/])
  maybePush('Education requirement', [/\bdegree\b/, /\bb\.?s\.?\b/, /\bm\.?s\.?\b/, /\bph\.?d\.?\b/])
  maybePush('Years of experience requirement', [/\b\d+\+?\s+years?\s+of\s+experience\b/])
  maybePush('Location requirement', [/\bon\-?site\b/, /\bhybrid\b/, /\bremote\b/])

  return {
    keyword_match: keywordMatch,
    capability_match: capabilityMatch,
    delta,
    gaps,
    job_techs: jobTechs,
    resume_techs: resumeTechs,
    job_tech_counts: jobTechCounts,
    resume_tech_counts: resumeTechCounts,
    ats_priority: atsPriority,
    transfer_map: transferMap,
    risk_flags: riskFlags,
    job_caps: jobCaps,
    resume_caps: resumeCaps,
    sankey: buildSankeyData(resumeTechs, jobTechs),
    radar: buildRadarData(jobCaps, resumeCaps)
  }
}
