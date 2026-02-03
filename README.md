# Skill Catalog

Personal portfolio showcasing capability-based skill analysis with the Skill Topology tool.

## Features

### Portfolio
- Professional landing page
- Experience highlights
- AI-Native Product Engineer positioning

### Skill Topology Tool
- 🔍 **Capability Analysis**: Maps technologies to root capabilities
- 📊 **Visual Proof**: Sankey diagrams show skill flow
- 🎯 **Gap Analysis**: Reveals transferable skills
- 🚀 **Hidden Value**: Shows 30%+ missed by traditional ATS

## Demo Results

**Traditional ATS:** 42% keyword match  
**Skill Topology:** 82% capability match  
**Hidden Value:** +40 points

## Quick Start

```bash
# Install
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Deploy

### Lovable (Recommended)
1. Push to GitHub
2. Import to Lovable: https://lovable.dev
3. One-click deploy

### Vercel
```bash
vercel --prod
```

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Vercel/Lovable deployment

## Structure

```
skill-catalog/
├── app/
│   ├── page.tsx              # Portfolio homepage
│   ├── skill-topology/       # Tool landing
│   │   ├── analyze/          # Analysis form
│   │   └── results/[id]/     # Results page
│   └── api/analyze/          # Backend API
├── components/ui/            # UI components
└── public/images/            # Assets
```

## TODO

- [ ] Add real Python Sankey generation
- [ ] PDF/DOCX resume upload
- [ ] Authentication (Supabase)
- [ ] Database storage
- [ ] Additional portfolio sections

## Author

Jay Bennett - AI-Native Product Engineer

## License

MIT
