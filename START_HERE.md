# 🎯 START HERE - Investment Due Diligence Agent

Welcome! This is your entry point to the Investment Due Diligence Agent MVP.

---

## 📚 Documentation Guide

This project has **comprehensive documentation**. Here's where to start:

### 🚀 Just Want to Run It?
**Read:** [QUICKSTART.md](./QUICKSTART.md)  
Get the app running in 5 minutes with step-by-step instructions.

### 📖 Want Full Details?
**Read:** [README.md](./README.md)  
Complete documentation including setup, usage, API reference, and deployment.

### 🏗️ Want to Understand the Architecture?
**Read:** [TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md)  
Deep dive into system design, agent implementation, and technical decisions.

### 📊 Want Project Statistics?
**Read:** [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)  
Project overview, metrics, deliverables, and success criteria.

### 🎨 Want Visual Architecture?
**Read:** [ARCHITECTURE.md](./ARCHITECTURE.md)  
System diagrams, data flows, and component hierarchies.

### 📑 Want Everything at a Glance?
**Read:** [INDEX.md](./INDEX.md)  
Complete project index with all features and highlights.

---

## ⚡ Quick Setup (3 Steps)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Add your OpenAI and Pinecone API keys to .env

# 3. Run
npm run dev
# Open http://localhost:3000
```

---

## 🎬 Try It Now

1. Use the sample documents included:
   - `sample-financial-report.txt`
   - `sample-business-plan.txt`

2. Upload both files at http://localhost:3000

3. Ask: "Should we invest in Company X?"

4. Get your AI-powered due diligence report in ~20 seconds!

---

## 📁 What's Included?

✅ **Full-Stack Application** - Next.js 15 + TypeScript + Tailwind  
✅ **3 AI Agents** - Financial, Market, Decision  
✅ **RAG System** - Pinecone vector database integration  
✅ **Quality Tools** - MCP Toolkit, Guardrails, Evals  
✅ **Sample Data** - Test documents included  
✅ **6 Documentation Files** - Everything you need to know  

---

## 🎯 Key Features

- 📄 Upload financial documents (PDF, TXT, DOC, DOCX)
- 🧠 AI-powered multi-agent analysis
- 💰 Financial metrics (EBITDA, debt, cash flow)
- 📊 Market intelligence (growth, competition)
- 🛡️ Risk assessment & mitigation strategies
- 📚 Citation tracking for all claims
- ✅ PROCEED/REVIEW/REJECT recommendations

---

## 🔧 Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI/LLM:** OpenAI GPT-4o-mini
- **Vector DB:** Pinecone
- **Deployment:** Vercel / Docker ready

---

## 💡 Need API Keys?

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account / log in
3. Generate API key
4. Add to `.env` as `OPENAI_API_KEY`

### Pinecone
1. Go to [pinecone.io](https://www.pinecone.io)
2. Sign up (free tier available)
3. Create index: `investment-due-diligence`
   - Dimensions: 3072
   - Metric: cosine
4. Add API key to `.env` as `PINECONE_API_KEY`

---

## 📊 Project Structure

```
investment-due-diligence-mvp/
├── src/
│   ├── app/              # Next.js pages & API
│   ├── components/       # React components
│   ├── lib/              # Core logic & agents
│   ├── types/            # TypeScript types
│   └── tests/            # Test framework
├── *.md                  # Documentation files
└── sample-*.txt          # Test documents
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
```

---

## 🚀 Next Steps

1. **Setup:** Follow [QUICKSTART.md](./QUICKSTART.md)
2. **Test:** Use sample documents
3. **Explore:** Read [README.md](./README.md)
4. **Customize:** Modify agents in `src/lib/agents/`
5. **Deploy:** Use Vercel or Docker

---

## 🎓 Learning Path

**Beginner:**
1. Read QUICKSTART.md
2. Run the application
3. Try sample documents
4. Read README.md overview

**Intermediate:**
1. Read TECHNICAL_OVERVIEW.md
2. Explore agent code
3. Modify prompts
4. Add evaluation scenarios

**Advanced:**
1. Study ARCHITECTURE.md
2. Add new agents
3. Customize UI
4. Deploy to production

---

## 📞 Need Help?

1. Check the documentation (6 files included)
2. Review code comments (comprehensive)
3. Look at sample implementations
4. Check error messages and logs

---

## ✨ Highlights

- ✅ Production-ready code
- ✅ TypeScript strict mode
- ✅ Comprehensive documentation
- ✅ Clean architecture
- ✅ Easy to extend
- ✅ Security best practices
- ✅ Performance optimized

---

## 🎯 Success Criteria

✅ MVP fully functional  
✅ Multi-agent system working  
✅ RAG properly implemented  
✅ Quality tools integrated  
✅ Documentation complete  
✅ Sample data provided  
✅ Ready to deploy  

---

**Let's get started!** → [QUICKSTART.md](./QUICKSTART.md)

Built with ❤️ by HenryCodeT | October 2025
