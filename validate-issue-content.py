#!/usr/bin/env python3
"""
Script to validate and preview the GitHub issue content from github-issue.md
Usage: python3 validate-issue-content.py
"""

import re
from pathlib import Path

def validate_issue_content():
    """Validate the issue file and show preview"""
    
    issue_file = "github-issue.md"
    
    if not Path(issue_file).exists():
        print(f"❌ Error: Issue file '{issue_file}' not found")
        return False
    
    # Read the issue file
    with open(issue_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.strip().split('\n')
    
    # Extract title
    title = lines[0].lstrip('# ').strip() if lines else ""
    
    # Extract body
    body = '\n'.join(lines[2:]) if len(lines) > 2 else ""
    
    print("🔍 GitHub Issue Content Validation")
    print("=" * 50)
    
    # Validate title
    print(f"📝 Title: {title}")
    if not title:
        print("❌ Warning: No title found")
        return False
    
    if len(title) > 256:
        print("⚠️  Warning: Title is very long (>256 chars)")
    
    # Validate content sections
    required_sections = [
        "Issue Summary",
        "Business Impact", 
        "Vulnerability Details",
        "Reproduction Steps",
        "Technical Requirements",
        "Proposed Solution",
        "Acceptance Criteria"
    ]
    
    print(f"\n📋 Content sections:")
    missing_sections = []
    
    for section in required_sections:
        if f"## {section}" in content:
            print(f"✅ {section}")
        else:
            print(f"❌ {section} (MISSING)")
            missing_sections.append(section)
    
    # Check for severity indicators
    severity_indicators = ["critical", "security", "vulnerability", "CVSS"]
    found_indicators = [ind for ind in severity_indicators if ind.lower() in content.lower()]
    
    print(f"\n🚨 Severity indicators found: {', '.join(found_indicators)}")
    
    # Check word count
    word_count = len(body.split())
    print(f"\n📊 Statistics:")
    print(f"   - Body word count: {word_count}")
    print(f"   - Body character count: {len(body)}")
    print(f"   - Total lines: {len(lines)}")
    
    # Show proposed labels
    proposed_labels = ["critical", "security", "bug", "financial-impact", "p0"]
    print(f"\n🏷️  Proposed labels: {', '.join(proposed_labels)}")
    
    # Preview first few lines of body
    print(f"\n👀 Body preview (first 500 chars):")
    print("-" * 50)
    print(body[:500] + "..." if len(body) > 500 else body)
    print("-" * 50)
    
    # Final validation
    is_valid = len(missing_sections) == 0 and bool(title) and word_count > 50
    
    print(f"\n✅ Validation result: {'PASSED' if is_valid else 'FAILED'}")
    
    if not is_valid:
        print("\n⚠️  Issues found:")
        if missing_sections:
            print(f"   - Missing sections: {', '.join(missing_sections)}")
        if not title:
            print("   - No title found")
        if word_count <= 50:
            print("   - Body content too short")
    else:
        print("🎉 Issue content is ready for creation!")
    
    return is_valid

def main():
    print("GitHub Issue Content Validator")
    print("=============================\n")
    
    try:
        is_valid = validate_issue_content()
        exit_code = 0 if is_valid else 1
        
        print(f"\nUse one of these commands to create the issue:")
        print(f"  python3 create-github-issue.py YOUR_TOKEN")
        print(f"  ./create-github-issue.sh YOUR_TOKEN")
        print(f"  Or use the GitHub Actions workflow")
        
        exit(exit_code)
        
    except Exception as e:
        print(f"❌ Validation failed with error: {e}")
        exit(1)

if __name__ == "__main__":
    main()