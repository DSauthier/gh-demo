#!/usr/bin/env python3
"""
Script to create a GitHub issue from github-issue.md
Usage: python3 create-github-issue.py [github_token]
If no token provided, will try to use GH_PAT or GITHUB_TOKEN environment variables
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from pathlib import Path

def create_github_issue(token, repo, title, body, labels=None):
    """Create a GitHub issue using the REST API"""
    
    url = f"https://api.github.com/repos/{repo}/issues"
    
    data = {
        "title": title,
        "body": body,
        "labels": labels or []
    }
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"HTTP Error {e.code}: {e.reason}")
        print(f"Response: {error_body}")
        return None

def main():
    repo = "DSauthier/gh-demo"
    issue_file = "github-issue.md"
    
    # Get token from command line argument or environment
    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1]
    else:
        token = os.environ.get('GH_PAT') or os.environ.get('GITHUB_TOKEN')
    
    if not token:
        print("Error: No GitHub token provided")
        print(f"Usage: {sys.argv[0]} [github_token]")
        print("Or set GH_PAT or GITHUB_TOKEN environment variable")
        sys.exit(1)
    
    # Check if issue file exists
    if not Path(issue_file).exists():
        print(f"Error: Issue file '{issue_file}' not found")
        sys.exit(1)
    
    # Read the issue file
    with open(issue_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.strip().split('\n')
    
    # Extract title (first line, remove markdown header)
    title = lines[0].lstrip('# ').strip()
    
    # Extract body (everything after the first line, skip empty line)
    body = '\n'.join(lines[2:]) if len(lines) > 2 else ""
    
    labels = ["critical", "security", "bug", "financial-impact", "p0"]
    
    print("Creating GitHub issue...")
    print(f"Title: {title}")
    print(f"Repository: {repo}")
    print(f"Labels: {', '.join(labels)}")
    print("")
    
    # Create the issue
    result = create_github_issue(token, repo, title, body, labels)
    
    if result and 'number' in result:
        print("✅ Issue created successfully!")
        print(f"Issue #{result['number']}: {result['html_url']}")
    else:
        print("❌ Failed to create issue")
        sys.exit(1)

if __name__ == "__main__":
    main()