#!/bin/bash

# Script to create a GitHub issue from github-issue.md
# Usage: ./create-github-issue.sh [token]
# If no token provided, will try to use GH_PAT or GITHUB_TOKEN environment variables

set -e

REPO="DSauthier/gh-demo"
ISSUE_FILE="github-issue.md"

# Get the token from parameter or environment
TOKEN="${1:-${GH_PAT:-${GITHUB_TOKEN}}}"

if [[ -z "$TOKEN" ]]; then
    echo "Error: No GitHub token provided"
    echo "Usage: $0 [github_token]"
    echo "Or set GH_PAT or GITHUB_TOKEN environment variable"
    exit 1
fi

if [[ ! -f "$ISSUE_FILE" ]]; then
    echo "Error: Issue file '$ISSUE_FILE' not found"
    exit 1
fi

# Extract title (first line, remove markdown header)
TITLE=$(head -n 1 "$ISSUE_FILE" | sed 's/^# //')

# Extract body (everything after line 2 to skip the title and empty line)
BODY=$(tail -n +3 "$ISSUE_FILE")

echo "Creating GitHub issue..."
echo "Title: $TITLE"
echo "Repository: $REPO"
echo ""

# Create the issue using GitHub REST API
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/$REPO/issues" \
  -d "$(jq -n \
    --arg title "$TITLE" \
    --arg body "$BODY" \
    --argjson labels '["critical", "security", "bug", "financial-impact", "p0"]' \
    '{
      title: $title,
      body: $body,
      labels: $labels
    }')")

# Check if the request was successful
if echo "$RESPONSE" | jq -e '.number' > /dev/null 2>&1; then
    ISSUE_NUMBER=$(echo "$RESPONSE" | jq -r '.number')
    ISSUE_URL=$(echo "$RESPONSE" | jq -r '.html_url')
    
    echo "✅ Issue created successfully!"
    echo "Issue #$ISSUE_NUMBER: $ISSUE_URL"
else
    echo "❌ Failed to create issue"
    echo "Response: $RESPONSE"
    exit 1
fi