# GitHub Issue Creation Guide

This guide provides multiple methods to create a GitHub issue from the `github-issue.md` file.

## Issue Details

The `github-issue.md` file contains a critical security vulnerability report:

**Title:** 🚨 CRITICAL: Users can manipulate checkout total to get free products

**Key Information:**
- **Severity:** Critical (CVSS 8.5)
- **Type:** Security Vulnerability - Business Logic Flaw
- **Impact:** Users can manipulate checkout totals to get products for free
- **Root Cause:** `/api/checkout` endpoint trusts client-supplied total parameter
- **Labels:** critical, security, bug, financial-impact, p0

## Methods to Create the Issue

### Method 1: GitHub Actions Workflow (Recommended)

A GitHub Actions workflow has been created at `.github/workflows/create-issue.yml`.

**To trigger:**
1. Go to the repository on GitHub
2. Click on "Actions" tab
3. Select "Create GitHub Issue from github-issue.md" workflow
4. Click "Run workflow"
5. Leave the default issue file path or specify a different one
6. Click "Run workflow"

The workflow will automatically create the issue with proper labels and content.

### Method 2: Bash Script

Use the provided bash script:

```bash
# With a GitHub token
./create-github-issue.sh YOUR_GITHUB_TOKEN

# Or set environment variable first
export GH_PAT=YOUR_GITHUB_TOKEN
./create-github-issue.sh
```

**Requirements:**
- `curl` command
- `jq` command (for JSON processing)
- GitHub Personal Access Token with `repo` scope

### Method 3: Python Script

Use the Python script (no external dependencies):

```bash
# With a GitHub token
python3 create-github-issue.py YOUR_GITHUB_TOKEN

# Or set environment variable first
export GH_PAT=YOUR_GITHUB_TOKEN
python3 create-github-issue.py
```

**Requirements:**
- Python 3.x
- GitHub Personal Access Token with `repo` scope

### Method 4: GitHub CLI

If you have GitHub CLI installed and authenticated:

```bash
# Extract title and create issue
TITLE=$(head -n 1 github-issue.md | sed 's/^# //')
tail -n +3 github-issue.md | gh issue create \
  --title "$TITLE" \
  --body-file - \
  --label "critical,security,bug,financial-impact,p0"
```

## GitHub Personal Access Token Setup

To create a Personal Access Token:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Set expiration and select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (if the repository is public)
4. Click "Generate token"
5. Copy the token (you won't see it again!)

## Expected Outcome

When successfully created, the issue will have:
- Title: "🚨 CRITICAL: Users can manipulate checkout total to get free products"
- Labels: critical, security, bug, financial-impact, p0
- Detailed description from `github-issue.md` including:
  - Vulnerability details and root cause
  - Step-by-step reproduction instructions
  - Technical requirements for fix
  - Proposed solution with code examples
  - Acceptance criteria
  - Business impact assessment

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check that your GitHub token is valid and has the right permissions
   - Ensure the token has `repo` scope for private repositories

2. **"Repository not found"**
   - Verify the repository name is correct: `DSauthier/gh-demo`
   - Check that you have access to the repository

3. **"Issue file not found"**
   - Ensure `github-issue.md` exists in the current directory
   - Check file permissions

4. **"jq command not found" (Bash script)**
   - Install jq: `sudo apt-get install jq` (Ubuntu/Debian) or `brew install jq` (macOS)
   - Use the Python script instead (no external dependencies)

### Validation:

After creating the issue, verify:
- Issue appears in the repository's Issues tab
- All labels are applied correctly
- Content is formatted properly
- Issue number is returned in the success message