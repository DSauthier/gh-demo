# Usage Example: Creating the Critical Security Issue

This document shows exactly how to use the created tools to generate the GitHub issue from `github-issue.md`.

## Quick Start

### Option 1: GitHub Actions (Easiest)

1. **Go to GitHub Repository**: Navigate to https://github.com/DSauthier/gh-demo
2. **Access Actions**: Click the "Actions" tab
3. **Find Workflow**: Look for "Create GitHub Issue from github-issue.md"
4. **Run Workflow**: 
   - Click "Run workflow" 
   - Leave default settings (uses `github-issue.md`)
   - Click "Run workflow" button
5. **Check Results**: The workflow will create the issue automatically

### Option 2: Command Line with Python (Cross-platform)

```bash
# If you have a GitHub Personal Access Token
export GH_PAT=ghp_your_token_here
python3 create-github-issue.py

# Or pass token directly
python3 create-github-issue.py ghp_your_token_here
```

### Option 3: Bash Script (Linux/macOS)

```bash
# Set token and run
export GH_PAT=ghp_your_token_here
./create-github-issue.sh

# Or pass token directly  
./create-github-issue.sh ghp_your_token_here
```

## Expected Issue Content

The created issue will contain:

### Title
```
🚨 CRITICAL: Users can manipulate checkout total to get free products
```

### Labels
- `critical`
- `security` 
- `bug`
- `financial-impact`
- `p0`

### Body Content
The issue body will include all sections from `github-issue.md`:

1. **Issue Summary** - Severity, type, impact (CVSS 8.5)
2. **Business Impact** - Revenue loss, scale risk, exploitation ease
3. **Vulnerability Details** - Root cause, vulnerable code location
4. **Reproduction Steps** - Step-by-step exploitation guide
5. **Technical Requirements** - Files to modify, security requirements
6. **Proposed Solution** - Secure code implementation
7. **Testing Requirements** - Validation test cases
8. **Acceptance Criteria** - Completion checklist
9. **Additional Context** - Related files, environment info, business priority

## Verification Steps

After creating the issue:

1. **Check Issue Creation**: Visit the repository's Issues tab
2. **Verify Content**: Ensure all markdown formatting is preserved
3. **Confirm Labels**: All 5 labels should be applied
4. **Review Details**: Complete vulnerability information should be present
5. **Test Links**: Any code blocks and formatting should display correctly

## Sample Success Output

```bash
Creating GitHub issue...
Title: 🚨 CRITICAL: Users can manipulate checkout total to get free products
Repository: DSauthier/gh-demo
Labels: critical, security, bug, financial-impact, p0

✅ Issue created successfully!
Issue #[NUMBER]: https://github.com/DSauthier/gh-demo/issues/[NUMBER]
```

## Troubleshooting Common Issues

### Authentication Problems
```bash
# Test your token first
curl -H "Authorization: token $GH_PAT" https://api.github.com/user
```

### Permission Issues
Ensure your token has `repo` scope for private repositories or `public_repo` for public ones.

### File Not Found
```bash
# Verify the file exists
ls -la github-issue.md
# Should show the issue file with content
```

This comprehensive approach ensures the critical security vulnerability is properly documented and tracked in GitHub Issues for immediate attention by the development team.