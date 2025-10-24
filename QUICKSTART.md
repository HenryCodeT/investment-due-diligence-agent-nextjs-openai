# 🚀 Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd investment-due-diligence-mvp
npm install
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your keys
nano .env  # or use your preferred editor
```

Add these values:
```
OPENAI_API_KEY=sk-your-key-here
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_NAME=investment-due-diligence
```

### Step 3: Set Up Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create a new index:
   - **Name**: `investment-due-diligence`
   - **Dimensions**: `3072`
   - **Metric**: `cosine`
   - **Cloud**: Any (e.g., AWS us-east-1)

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Step 5: Test with Sample Documents

Use the included sample documents:
- `sample-financial-report.txt`
- `sample-business-plan.txt`

Upload both and ask: "Should we invest in Company X?"

---

## First Analysis Walkthrough

1. **Upload Documents**
   - Click or drag files into the upload area
   - Upload both financial and business plan documents

2. **Enter Query**
   - Example: "Should we invest in Company X? What are the main risks?"

3. **Click Analyze**
   - Wait 15-30 seconds for analysis

4. **Review Report**
   - See recommendation (PROCEED/REVIEW/REJECT)
   - Read executive summary
   - Check financial metrics
   - Review risk mitigation strategies

5. **Export (Optional)**
   - Click "Export Report" to download JSON

---

## Troubleshooting

### "Cannot find module 'next'"
```bash
npm install
```

### "OpenAI API key not set"
Check that `.env` file exists and contains valid `OPENAI_API_KEY`

### "Pinecone query failed"
- Verify index name matches `.env` configuration
- Ensure index dimensions are 3072
- Check API key is valid

### "Analysis takes forever"
- First run may be slower (cold start)
- Large documents take longer to process
- Check your internet connection

---

## Running Tests
```bash
npm run test:evals
```

---

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md) for architecture details
- Explore the code in `src/` directory
- Customize agents in `src/lib/agents/`

---

## Getting API Keys

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create new secret key
5. Copy and save securely

### Pinecone
1. Go to [pinecone.io](https://www.pinecone.io)
2. Sign up for free account
3. Create project
4. Copy API key from project settings

---

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [TECHNICAL_OVERVIEW.md](./TECHNICAL_OVERVIEW.md) for architecture
- Open an issue on GitHub
- Check console logs for error details

---

**Happy Analyzing! 🧠💼**
