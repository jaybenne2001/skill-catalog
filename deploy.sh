#!/bin/bash
# Quick deploy script - run this after extracting tarball

echo "🚀 Deploying Skill Catalog..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Run this from skill-catalog directory"
  exit 1
fi

# Check for changes
if git diff --quiet && git diff --cached --quiet; then
  echo "✓ No changes to commit"
else
  echo "📝 Committing changes..."
  git add -A
  git commit -m "Update from tarball $(date +%Y-%m-%d)"
fi

# Add remote if needed
if ! git remote get-url origin > /dev/null 2>&1; then
  echo "🔗 Adding remote..."
  git remote add origin https://github.com/jaybenne2001/skill-catalog.git
fi

# Push
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -f origin main

echo ""
echo "✅ Deployed!"
echo "🌐 Check build at: https://console.aws.amazon.com/amplify"
echo "🔗 Live site: https://main.d1l8om68t2s8be.amplifyapp.com"
