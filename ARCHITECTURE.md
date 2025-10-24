# System Architecture Diagrams

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│              (Next.js 15 + React + Tailwind)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API LAYER (Next.js)                       │
│                   /api/analyze endpoint                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Validates Input
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  INPUT GUARDRAILS                            │
│          Sanitize, Validate, Security Checks                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  DOCUMENT PROCESSING                         │
│         ┌──────────────────────────────────┐                │
│         │  1. Text Extraction              │                │
│         │  2. Generate Embeddings (OpenAI) │                │
│         │  3. Store in Pinecone            │                │
│         └──────────────────────────────────┘                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│               MCP ORCHESTRATOR                               │
│          (Model Context Protocol Toolkit)                    │
│                                                              │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│    │   Register   │  │    Invoke    │  │     Log      │   │
│    │    Agents    │  │    Agents    │  │   Actions    │   │
│    └──────────────┘  └──────────────┘  └──────────────┘   │
└───────────┬──────────────────────────────────┬─────────────┘
            │                                  │
            │                                  │
    ┌───────▼──────────┐            ┌─────────▼──────────┐
    │                  │            │                     │
    │  FINANCIAL       │            │   MARKET           │
    │  AGENT           │            │   AGENT            │
    │                  │            │                     │
    │  Analyzes:       │            │  Analyzes:         │
    │  • EBITDA        │            │  • Growth Rate     │
    │  • Debt Ratio    │            │  • Competition     │
    │  • Cash Flow     │            │  • Market Share    │
    │  • Risks         │            │  • Opportunities   │
    │                  │            │  • Threats         │
    └────────┬─────────┘            └─────────┬──────────┘
             │                                │
             │         RAG Queries            │
             │      (Pinecone + OpenAI)       │
             │                                │
             └──────────┬─────────────────────┘
                        │
                        │ Both Results
                        │
            ┌───────────▼──────────────┐
            │                          │
            │   DECISION AGENT         │
            │                          │
            │   Synthesizes:           │
            │   • Recommendation       │
            │   • Risk Mitigation      │
            │   • Citations            │
            │   • Final Report         │
            │                          │
            └───────────┬──────────────┘
                        │
                        │
            ┌───────────▼──────────────┐
            │  OUTPUT GUARDRAILS       │
            │  Validate Report Format  │
            └───────────┬──────────────┘
                        │
                        │
            ┌───────────▼──────────────┐
            │  DUE DILIGENCE REPORT    │
            │                          │
            │  • Recommendation        │
            │  • Financial Analysis    │
            │  • Market Analysis       │
            │  • Risk Mitigation       │
            │  • Citations             │
            └──────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Upload Documents + Query
     │
     ▼
┌────────────────┐
│  Next.js App   │
│  (Frontend)    │
└────┬───────────┘
     │
     │ 2. POST /api/analyze
     │
     ▼
┌────────────────────┐
│  API Route         │
│  (Backend)         │
└────┬───────────────┘
     │
     │ 3. Process Files
     │
     ▼
┌────────────────────┐      4. Generate Embeddings      ┌──────────┐
│  Document          │ ──────────────────────────────► │  OpenAI  │
│  Processing        │                                  │  API     │
└────┬───────────────┘                                  └──────────┘
     │
     │ 5. Store Vectors
     │
     ▼
┌────────────────────┐
│   Pinecone DB      │
│  (Vector Store)    │
└────┬───────────────┘
     │
     │ 6. Query for Relevant Docs
     │
     ▼
┌────────────────────┐
│  Financial Agent   │ ───┐
└────────────────────┘    │
                          │ 7. Analyze
┌────────────────────┐    │
│  Market Agent      │ ───┤
└────────────────────┘    │
                          │
                          ▼
                  ┌───────────────┐
                  │ Decision      │
                  │ Agent         │
                  └───────┬───────┘
                          │
                          │ 8. Generate Report
                          │
                          ▼
                  ┌───────────────┐
                  │ Validate      │
                  │ Output        │
                  └───────┬───────┘
                          │
                          │ 9. Return JSON
                          │
                          ▼
                  ┌───────────────┐
                  │ Frontend      │
                  │ (Display)     │
                  └───────────────┘
```

---

## Agent Interaction Flow

```
                    ┌─────────────────┐
                    │  User Query +   │
                    │  Documents      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Input Guardrail │
                    │  - Validate     │
                    │  - Sanitize     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ MCP Orchestrator│
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │ Financial Agent  │      │  Market Agent    │
    │                  │      │                  │
    │ 1. Query RAG     │      │ 1. Query RAG     │
    │ 2. Build Context │      │ 2. Build Context │
    │ 3. Call OpenAI   │      │ 3. Call OpenAI   │
    │ 4. Parse JSON    │      │ 4. Parse JSON    │
    │ 5. Return Output │      │ 5. Return Output │
    └────────┬─────────┘      └─────────┬────────┘
             │                          │
             │   Financial Analysis     │   Market Analysis
             │                          │
             └────────────┬─────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │   Decision Agent     │
              │                      │
              │ 1. Receive Inputs    │
              │ 2. Synthesize        │
              │ 3. Generate Rec.     │
              │ 4. Create Mitigation │
              │ 5. Consolidate Cites │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Output Guardrail    │
              │  - Check Sections    │
              │  - Validate Format   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Due Diligence Report │
              │  - Recommendation    │
              │  - Analyses          │
              │  - Risks             │
              │  - Citations         │
              └──────────────────────┘
```

---

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Next.js    │  │    React     │  │  Tailwind    │ │
│  │      15      │  │     18       │  │     CSS      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                     API LAYER                            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │        Next.js API Routes (TypeScript)           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     MCP      │  │  Guardrails  │  │    Evals     │ │
│  │   Toolkit    │  │   Module     │  │  Framework   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Agent Implementations                │   │
│  │  • Financial Agent                              │   │
│  │  • Market Agent                                 │   │
│  │  • Decision Agent                               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                  INTEGRATION LAYER                       │
│                                                          │
│  ┌──────────────┐                  ┌──────────────┐    │
│  │   OpenAI     │                  │  Pinecone    │    │
│  │   Client     │                  │   Client     │    │
│  └──────────────┘                  └──────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
│                                                          │
│  ┌──────────────┐                  ┌──────────────┐    │
│  │   OpenAI     │                  │  Pinecone    │    │
│  │     API      │                  │  Vector DB   │    │
│  │  GPT-4o-mini │                  │              │    │
│  └──────────────┘                  └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## File System Structure

```
investment-due-diligence-mvp/
│
├── 📁 src/                          ← Source Code
│   ├── 📁 app/                      ← Next.js App Directory
│   │   ├── 📁 api/
│   │   │   └── 📁 analyze/
│   │   │       └── route.ts         ← API Endpoint
│   │   ├── 📁 analyze/
│   │   │   └── page.tsx             ← Results Page
│   │   ├── layout.tsx               ← Root Layout
│   │   ├── page.tsx                 ← Home Page
│   │   └── globals.css              ← Global Styles
│   │
│   ├── 📁 components/               ← React Components
│   │   ├── Button.tsx
│   │   └── FileUploader.tsx
│   │
│   ├── 📁 lib/                      ← Core Libraries
│   │   ├── 📁 agents/               ← AI Agents
│   │   │   ├── financialAgent.ts
│   │   │   ├── marketAgent.ts
│   │   │   └── decisionAgent.ts
│   │   ├── openai.ts                ← OpenAI Integration
│   │   ├── pinecone.ts              ← Pinecone Integration
│   │   ├── mcp.ts                   ← MCP Toolkit
│   │   ├── guardrails.ts            ← Validation Layer
│   │   └── evals.ts                 ← Testing Framework
│   │
│   ├── 📁 types/                    ← TypeScript Types
│   │   └── agent.d.ts
│   │
│   ├── 📁 data/                     ← Static Data
│   │   └── evals.json               ← Test Scenarios
│   │
│   └── 📁 tests/                    ← Test Runners
│       └── runEvals.ts
│
├── 📄 Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
├── 📄 Environment
│   └── .env.example
│
├── 📄 Documentation
│   ├── README.md                    ← Main Documentation
│   ├── QUICKSTART.md                ← Quick Setup
│   ├── TECHNICAL_OVERVIEW.md        ← Architecture
│   ├── PROJECT_SUMMARY.md           ← Project Info
│   ├── INDEX.md                     ← Entry Point
│   └── ARCHITECTURE.md              ← This File
│
├── 📄 Sample Data
│   ├── sample-financial-report.txt
│   └── sample-business-plan.txt
│
└── 📄 Scripts
    └── setup.sh
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    RootLayout                            │
│                  (app/layout.tsx)                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Page Component                     │    │
│  │                                                 │    │
│  │  Home Page (app/page.tsx)                      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   FileUploader Component            │      │    │
│  │  │   - Drag & Drop                     │      │    │
│  │  │   - File List                       │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Query Input (textarea)            │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Button Component                  │      │    │
│  │  │   - Submit Analysis                 │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │                                                 │    │
│  │  OR                                             │    │
│  │                                                 │    │
│  │  Results Page (app/analyze/page.tsx)          │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Recommendation Badge              │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Financial Analysis Section        │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Market Analysis Section           │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Risk Mitigation Section           │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Citations Section                 │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  │  ┌─────────────────────────────────────┐      │    │
│  │  │   Button Component (Export)         │      │    │
│  │  └─────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Sequence Diagram - Complete Analysis Flow

```
User    Frontend    API    Guardrail    MCP    FinAgent    MktAgent    DecAgent    OpenAI    Pinecone
 │          │        │         │         │         │           │           │          │          │
 │ Upload   │        │         │         │         │           │           │          │          │
 ├─────────>│        │         │         │         │           │           │          │          │
 │          │        │         │         │         │           │           │          │          │
 │ Submit   │        │         │         │         │           │           │          │          │
 ├─────────>│ POST   │         │         │         │           │           │          │          │
 │          ├───────>│         │         │         │           │           │          │          │
 │          │        │Validate │         │         │           │           │          │          │
 │          │        ├────────>│         │         │           │           │          │          │
 │          │        │         │ OK      │         │           │           │          │          │
 │          │        │<────────┤         │         │           │           │          │          │
 │          │        │         │         │         │           │           │          │          │
 │          │        │         │ Embed   │         │           │           │          │          │
 │          │        ├─────────┴─────────┴─────────┴───────────┴───────────┴─────────>│          │
 │          │        │         │         │         │           │           │ Vectors  │          │
 │          │        │<────────┴─────────┴─────────┴───────────┴───────────┴──────────┤          │
 │          │        │         │         │         │           │           │          │          │
 │          │        │         │         │ Store   │           │           │          │          │
 │          │        ├─────────┴─────────┴─────────┴───────────┴───────────┴──────────┴─────────>│
 │          │        │         │         │         │           │           │          │  Stored  │
 │          │        │<────────┴─────────┴─────────┴───────────┴───────────┴──────────┴──────────┤
 │          │        │         │         │         │           │           │          │          │
 │          │        │         │         │ Invoke  │           │           │          │          │
 │          │        ├─────────┴─────────>│FinAgent│           │           │          │          │
 │          │        │         │         ├────────>│           │           │          │          │
 │          │        │         │         │         │ Query RAG │           │          │          │
 │          │        │         │         │         ├───────────┴───────────┴──────────┴─────────>│
 │          │        │         │         │         │           │           │          │ Results  │
 │          │        │         │         │         │<──────────┴───────────┴──────────┴──────────┤
 │          │        │         │         │         │ Analyze   │           │          │          │
 │          │        │         │         │         ├───────────┴───────────┴─────────>│          │
 │          │        │         │         │         │           │           │  Result  │          │
 │          │        │         │         │         │<──────────┴───────────┴──────────┤          │
 │          │        │         │         │ Output  │           │           │          │          │
 │          │        │         │         │<────────┤           │           │          │          │
 │          │        │         │         │         │           │           │          │          │
 │          │        │         │         │ Invoke  │           │           │          │          │
 │          │        ├─────────┴─────────>│MktAgent│           │           │          │          │
 │          │        │         │         ├────────┴──────────>│           │          │          │
 │          │        │         │         │         │           │ Query RAG │          │          │
 │          │        │         │         │         │           ├───────────┴──────────┴─────────>│
 │          │        │         │         │         │           │           │          │ Results  │
 │          │        │         │         │         │           │<──────────┴──────────┴──────────┤
 │          │        │         │         │         │           │ Analyze   │          │          │
 │          │        │         │         │         │           ├───────────┴─────────>│          │
 │          │        │         │         │         │           │           │  Result  │          │
 │          │        │         │         │         │           │<──────────┴──────────┤          │
 │          │        │         │         │         │  Output   │           │          │          │
 │          │        │         │         │<────────┴───────────┤           │          │          │
 │          │        │         │         │         │           │           │          │          │
 │          │        │         │ Invoke  │         │           │           │          │          │
 │          │        ├─────────┴─────────>│DecAgent│           │           │          │          │
 │          │        │         │         ├────────┴───────────┴──────────>│          │          │
 │          │        │         │         │         │           │           │Synthesize│          │
 │          │        │         │         │         │           │           ├─────────>│          │
 │          │        │         │         │         │           │           │  Report  │          │
 │          │        │         │         │         │           │           │<─────────┤          │
 │          │        │         │         │         │  Report   │           │          │          │
 │          │        │         │         │<────────┴───────────┴───────────┤          │          │
 │          │        │         │Validate │         │           │           │          │          │
 │          │        ├────────>│         │         │           │           │          │          │
 │          │        │         │ OK      │         │           │           │          │          │
 │          │        │<────────┤         │         │           │           │          │          │
 │          │ JSON   │         │         │         │           │           │          │          │
 │          │<───────┤         │         │         │           │           │          │          │
 │ Display  │        │         │         │         │           │           │          │          │
 │<─────────┤        │         │         │         │           │           │          │          │
```

---

## Decision Flow Chart

```
                    ┌─────────────────┐
                    │  Start Analysis │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Parse Inputs   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Financial Good? │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                  YES                NO
                    │                 │
                    ▼                 ▼
            ┌─────────────┐   ┌─────────────┐
            │Market Good? │   │   REJECT    │
            └──────┬──────┘   └─────────────┘
                   │
          ┌────────┴────────┐
          │                 │
        YES                NO
          │                 │
          ▼                 ▼
  ┌──────────────┐  ┌──────────────┐
  │Low Risk?     │  │   REVIEW     │
  └──────┬───────┘  └──────────────┘
         │
    ┌────┴────┐
    │         │
  YES        NO
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│PROCEED │ │REVIEW  │
└────────┘ └────────┘
```

---

These diagrams provide a comprehensive visual representation of the Investment Due Diligence Agent's architecture, data flow, and component interactions.
