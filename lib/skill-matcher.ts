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

  return {
    keyword_match: keywordMatch,
    capability_match: capabilityMatch,
    delta,
    gaps,
    job_techs: jobTechs,
    resume_techs: resumeTechs,
    job_caps: jobCaps,
    resume_caps: resumeCaps,
    sankey: buildSankeyData(resumeTechs, jobTechs),
    radar: buildRadarData(jobCaps, resumeCaps)
  }
}
