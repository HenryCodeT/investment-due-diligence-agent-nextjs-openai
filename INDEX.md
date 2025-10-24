# 🧠 Investment Due Diligence Agent

**Multi-Agent RAG System for AI-Powered Investment Analysis**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)](https://openai.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-orange)](https://www.pinecone.io/)

---

## 📋 Documentation Index

This project includes comprehensive documentation to help you get started quickly:

### 🚀 For Quick Start
- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[README.md](./README.md)** - Complete user guide and reference

### 🏗️ For Developers
- **[TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md)** - Architecture and internals
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview and metrics

### 📝 Sample Documents
- **sample-financial-report.txt** - Example financial document
- **sample-business-plan.txt** - Example business plan

---

## 🎯 What Is This?

An AI-powered system that analyzes investment opportunities by:

1. **Uploading** financial documents and business plans
2. **Processing** documents using RAG (Retrieval-Augmented Generation)
3. **Analyzing** with specialized AI agents:
   - 💰 **Financial Agent** - EBITDA, debt, cash flow
   - 📊 **Market Agent** - Growth, competition, opportunities
   - 🎯 **Decision Agent** - Synthesis and recommendations
4. **Generating** comprehensive due diligence reports with:
   - Clear recommendation (PROCEED/REVIEW/REJECT)
   - Risk mitigation strategies
   - Cited sources

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Run development server
npm run dev

# 4. Open browser
open http://localhost:3000
```

**Need API Keys?**
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Pinecone API Key](https://app.pinecone.io/)

---

## 🎬 Demo Workflow

1. Navigate to http://localhost:3000
2. Upload `sample-financial-report.txt` and `sample-business-plan.txt`
3. Enter query: "Should we invest in Company X?"
4. Click "Analyze Investment"
5. Review comprehensive report in ~20 seconds

---

## 🏗️ Architecture

```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
┌──────▼──────────────────────┐
│   Next.js Application       │
│   (App Router + API)        │
└──────┬──────────────────────┘
       │
┌──────▼──────────────────────┐
│  MCP Orchestrator           │
│  (Agent Management)         │
└──────┬──────────────────────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌──▼──┐
│ FIN │  │ MKT │  ← Specialized Agents
└──┬──┘  └──┬──┘
   │        │
   └───┬────┘
       │
   ┌───▼────┐
   │ DECIDE │  ← Decision Agent
   └───┬────┘
       │
┌──────▼──────────────────────┐
│  Due Diligence Report       │
└─────────────────────────────┘

Database: Pinecone (Vector DB)
LLM: OpenAI GPT-4o-mini
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI/LLM** | OpenAI GPT-4o-mini |
| **Vector DB** | Pinecone |
| **Deployment** | Vercel / Docker |

---

## 🎨 Features

### Core Capabilities
- ✅ Multi-document analysis (PDF, TXT, DOC, DOCX)
- ✅ AI-powered financial analysis
- ✅ Market intelligence gathering
- ✅ Risk assessment and mitigation
- ✅ Citation tracking
- ✅ Export reports (JSON)

### Technical Features
- ✅ RAG architecture for grounded analysis
- ✅ Multi-agent coordination
- ✅ Input/output validation (Guardrails)
- ✅ Audit logging (MCP Toolkit)
- ✅ Evaluation framework
- ✅ TypeScript strict mode
- ✅ Responsive design

---

## 📊 Project Files

```
investment-due-diligence-mvp/
├── 📄 README.md                    ← Main documentation
├── 📄 QUICKSTART.md                ← 5-minute setup guide
├── 📄 TECHNICAL_OVERVIEW.md        ← Architecture details
├── 📄 PROJECT_SUMMARY.md           ← Project metrics
│
├── 📁 src/
│   ├── 📁 app/                     ← Next.js pages
│   │   ├── 📁 api/analyze/         ← API endpoint
│   │   ├── 📁 analyze/             ← Results page
│   │   ├── page.tsx                ← Home page
│   │   ├── layout.tsx              ← Root layout
│   │   └── globals.css             ← Styles
│   │
│   ├── 📁 components/              ← React components
│   │   ├── Button.tsx
│   │   └── FileUploader.tsx
│   │
│   ├── 📁 lib/                     ← Core libraries
│   │   ├── 📁 agents/              ← AI agents
│   │   │   ├── financialAgent.ts
│   │   │   ├── marketAgent.ts
│   │   │   └── decisionAgent.ts
│   │   ├── openai.ts               ← OpenAI utilities
│   │   ├── pinecone.ts             ← Pinecone utilities
│   │   ├── mcp.ts                  ← Agent management
│   │   ├── guardrails.ts           ← Validation
│   │   └── evals.ts                ← Testing
│   │
│   ├── 📁 types/                   ← TypeScript types
│   ├── 📁 data/                    ← Test data
│   └── 📁 tests/                   ← Test runners
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.js
├── 📄 next.config.js
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 setup.sh                     ← Setup script
├── 📄 sample-financial-report.txt  ← Example doc
└── 📄 sample-business-plan.txt     ← Example doc
```

---

## 🧪 Testing

```bash
# Run evaluation tests
npm run test:evals

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker
```bash
# Build image
docker build -t investment-dd-agent .

# Run container
docker run -p 3000:3000 investment-dd-agent
```

---

## 📈 Performance

- **Analysis Time**: 15-30 seconds
- **Cost per Analysis**: ~$0.02-0.03
- **Supported Documents**: Up to 5 files, 10MB each
- **Concurrent Users**: Scales with infrastructure

---

## 🔐 Security

- ✅ Input sanitization
- ✅ File validation
- ✅ Environment variable protection
- ✅ Sensitive data detection
- ✅ API key security

---

## 🎓 Learn More

### Recommended Reading Order

1. **First Time Users**
   - Start with [QUICKSTART.md](./QUICKSTART.md)
   - Try the sample documents
   - Read [README.md](./README.md) for details

2. **Developers**
   - Review [TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md)
   - Explore `src/lib/agents/` for agent implementation
   - Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for metrics

3. **Advanced Users**
   - Customize agents for your use case
   - Add new evaluation scenarios
   - Extend with additional features

---

## 🤝 Contributing

This is an MVP project. Contributions welcome!

### Areas for Enhancement
- Additional specialized agents (Legal, ESG, Technical)
- More document format support
- Advanced visualization
- Real-time collaboration
- Mobile application
- API for integrations

---

## 📄 License

MIT License - See LICENSE file

---

## 👨‍💻 Author

**HenryCodeT**  
Investment Due Diligence Agent MVP  
© 2025

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- Pinecone for vector database
- Next.js team for the framework
- Tailwind CSS for styling

---

## 📞 Support

- 📖 Read the documentation files
- 💬 Check code comments
- 🐛 Review error logs
- 📧 Open GitHub issues

---

## ⭐ Key Highlights

1. **Production Ready** - Not a prototype, real MVP
2. **Well Documented** - 4 comprehensive guides
3. **Clean Code** - TypeScript, modular, maintainable
4. **Enterprise Features** - MCP, Guardrails, Evals
5. **Easy Setup** - Works in 5 minutes
6. **Extensible** - Clean architecture for growth

---

**Status**: ✅ Complete and Ready  
**Version**: 1.0.0 (MVP)  
**Last Updated**: October 2025

---

## 🎯 Quick Links

- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [Full Documentation](./README.md) - Complete reference
- [Technical Details](./TECHNICAL_OVERVIEW.md) - Architecture
- [Project Summary](./PROJECT_SUMMARY.md) - Overview and metrics

---

**Built with ❤️ for better investment decisions**

[Get Started →](./QUICKSTART.md)
