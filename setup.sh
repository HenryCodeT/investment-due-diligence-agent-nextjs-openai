#!/bin/bash

# Investment Due Diligence Agent - Setup Script
# This script helps set up the project for first-time use

echo "=========================================="
echo "Investment Due Diligence Agent - Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✓ .env file found"
else
    echo "⚠ Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠ IMPORTANT: Please edit .env and add your API keys:"
    echo "  - OPENAI_API_KEY"
    echo "  - PINECONE_API_KEY"
    echo ""
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✓ Dependencies already installed"
else
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed successfully"
    else
        echo "✗ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Create a Pinecone index:"
echo "   - Dimensions: 3072"
echo "   - Metric: cosine"
echo "   - Name: investment-due-diligence"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "For testing, you can use the sample documents:"
echo "  - sample-financial-report.txt"
echo "  - sample-business-plan.txt"
echo ""
