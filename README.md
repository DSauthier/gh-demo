# 🛒 Shopping Cart Demo: Copilot + GHAS DevSecOps Workflow

A 10-minute live demo showcasing how GitHub Copilot and GitHub Advanced Security work together to identify, analyze, and fix business logic vulnerabilities in a realistic shopping cart application.

## 🎯 Demo Overview

This demo features a mini shopping cart application (like a simplified Amazon) with a **deliberately vulnerable refund system** that allows customers to exploit negative refund amounts to gain money instead of being charged. The demo shows the complete DevSecOps loop: from vulnerability discovery to Copilot-assisted remediation and secure deployment.

## 🚨 The Vulnerability

**Business Impact**: Customers can exploit the refund system by entering negative amounts, effectively reversing charges and getting money from the business.

**Technical Details**: The `/api/refund` endpoint lacks proper input validation and business logic checks, allowing negative refund amounts that add money to customer accounts instead of processing legitimate refunds.

## 🎬 10-Minute Demo Script

### **Minutes 1-2: Problem Setup & Business Impact**
> "Today I'll show you a real-world DevSecOps scenario where GitHub Copilot and GHAS help us quickly identify and fix a critical business logic vulnerability."

1. **Start the vulnerable application:**
   ```bash
   npm install && npm start
   ```

2. **Demo the vulnerability live:**
   - Open `http://localhost:3000`
   - Add items to cart (e.g., 2x Wireless Headphones = $159.98)
   - Checkout to create Order #1
   - In refund section, enter Order ID `1` and refund amount `-100`
   - Show how customer gets money instead of being charged

3. **Explain business impact:**
   > "This isn't just a technical bug - customers discovered they can get money from us by entering negative refund amounts. Our finance team noticed unusual transactions where customers were being paid instead of charged."

### **Minutes 3-4: GitHub Issue & Documentation**
> "Let's see how this would typically flow through our development process."

1. **Show pre-created GitHub issue** (create this beforehand):
   ```
   Title: "Customers can exploit refund system with negative amounts"
   
   Description:
   - Customers discovered they can enter negative refund amounts
   - Instead of being charged, they receive money
   - Financial impact: $XX,XXX in fraudulent transactions
   - Affected endpoint: POST /api/refund
   - Steps to reproduce: [include screenshots]
   ```

2. **Demonstrate the issue in code:**
   - Open `app.js`, navigate to `/api/refund` endpoint (line ~85)
   - Point out missing validation: "No check for negative amounts"

### **Minutes 5-7: Copilot Agent Solution**
> "Now let's see how GitHub Copilot can help us analyze and fix this vulnerability."

1. **Open GitHub Copilot Chat/Workspace and use this prompt:**
   ```
   I have a GitHub issue (#[issue-number]) about customers exploiting our refund system with negative amounts. Please:
   1. Analyze the refund endpoint in app.js 
   2. Identify the security vulnerability
   3. Implement a comprehensive fix with proper input validation and business logic
   4. Ensure the fix prevents all potential abuse scenarios
   
   The fix should include:
   - Input validation for refund amounts (must be positive)
   - Business logic validation (refund can't exceed order total)
   - Proper error handling and security responses
   - Prevention of double-refunds
   ```

2. **Show Copilot's analysis:**
   - Watch Copilot identify the vulnerability
   - Review the proposed fixes
   - Highlight how Copilot understands business context, not just code syntax

3. **Apply the fix or show the pre-prepared `app-fixed.js`:**
   - Point out the key improvements:
     - Input validation: `if (refundValue <= 0)`
     - Business logic: `if (refundValue > order.total_amount)`
     - Status checks: `if (order.status === 'refunded')`

### **Minutes 8-9: Testing & GitHub Actions Deployment**
> "Let's verify our fix works and show the automated deployment pipeline."

1. **Test the fixed version:**
   ```bash
   npm run start-fixed
   ```
   - Try the same exploit: Order something, then try negative refund
   - Show error: "Invalid refund amount. Refund amount must be a positive number."

2. **Show the GitHub Actions workflow:**
   - Open `.github/workflows/deploy.yml`
   - Explain the pipeline: CodeQL security scan → Deploy to EC2
   - Show how GHAS would detect similar vulnerabilities automatically

3. **Commit and push the fix:**
   ```bash
   git add app-fixed.js
   git commit -m "fix: implement proper refund validation (Copilot assisted)"
   git push origin main
   ```

### **Minute 10: Results & DevSecOps Loop Completion**
> "This demonstrates the complete DevSecOps loop with AI assistance."

1. **Show the complete workflow:**
   - ✅ Issue identified and documented
   - ✅ Copilot analyzed and provided comprehensive fix
   - ✅ Automated testing and deployment
   - ✅ Security vulnerability resolved

2. **Key takeaways:**
   - Copilot understands business logic, not just security patterns
   - AI-assisted development speeds up critical fixes
   - GHAS provides continuous security monitoring
   - Complete automation from issue to deployment

## 🛠️ Setup Instructions

### Pre-Demo Setup (5 minutes before demo):

1. **Clone and initialize:**
   ```bash
   git clone [your-repo-url]
   cd shopping-cart-demo
   npm install
   ```

2. **Create GitHub issue** (use template above)

3. **Test both versions work:**
   ```bash
   npm start          # Test vulnerable version
   npm run start-fixed # Test fixed version
   ```

### During Demo:

1. **Start with vulnerable version**: `npm start`
2. **Demo exploit**: Add items → Checkout → Negative refund
3. **Show Copilot fix**: Use provided prompt
4. **Test fix**: `npm run start-fixed`
5. **Deploy**: Show GitHub Actions workflow

## 🤖 Copilot Prompts Used

### Main Analysis Prompt:
```
I have a GitHub issue about customers exploiting our refund system with negative amounts. Please:
1. Analyze the refund endpoint in app.js 
2. Identify the security vulnerability
3. Implement a comprehensive fix with proper input validation and business logic
4. Ensure the fix prevents all potential abuse scenarios

The fix should include:
- Input validation for refund amounts (must be positive)
- Business logic validation (refund can't exceed order total)
- Proper error handling and security responses
- Prevention of double-refunds
```

### Follow-up Prompts:
```
"Explain why this vulnerability is particularly dangerous from a business perspective"
"What other similar vulnerabilities should we check for in our codebase?"
"Generate test cases to verify our fix works correctly"
```

## 🧪 Testing Commands

```bash
# Quick vulnerability test
npm test

# Manual API test (vulnerable version)
curl -X POST http://localhost:3000/api/refund \
  -H "Content-Type: application/json" \
  -d '{"order_id": 1, "refund_amount": -100}'

# Test the UI exploit
# 1. Add items to cart
# 2. Checkout
# 3. Enter negative refund amount in UI
```

## 🎯 Demo Tips

### For Success:
- **Practice the exploit** beforehand - know exactly which buttons to click
- **Prepare the GitHub issue** ahead of time with screenshots
- **Test Copilot prompts** - AI responses can vary, have backup explanations ready
- **Have `app-fixed.js` ready** in case Copilot is slow during live demo

### Fallback Plan:
If Copilot is slow or unavailable during demo:
1. Show the pre-prepared `app-fixed.js` file
2. Explain: "Here's what Copilot generated when I ran this earlier"
3. Walk through the key fixes manually
4. Emphasize the comprehensive nature of AI-generated solution

### Key Talking Points:
- **Business impact**: This isn't academic - real money loss
- **AI understanding**: Copilot grasps business logic, not just syntax
- **Comprehensive fixes**: AI considers multiple attack vectors
- **Speed**: Minutes instead of hours for analysis and fix
- **Integration**: Seamless DevSecOps workflow

## 📁 Project Structure

```
shopping-cart-demo/
├── package.json              # Node.js dependencies and scripts
├── db.js                     # In-memory SQLite database setup
├── app.js                    # Vulnerable shopping cart server
├── app-fixed.js              # Secure version with proper validation
├── test-refund-exploit.js    # Automated vulnerability test
├── run-demo.ps1              # Demo startup script
├── public/
│   └── index.html            # Shopping cart UI
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions deployment pipeline
└── README.md                 # This file
```

## 🔧 Technical Details

- **Framework**: Node.js + Express
- **Database**: In-memory SQLite (no external dependencies)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Vulnerability**: Business logic flaw in refund processing
- **Fix**: Input validation + business rules + error handling

## 🏆 Demo Success Metrics

- [ ] Audience understands the business impact
- [ ] Vulnerability exploit is clearly demonstrated
- [ ] Copilot's analysis capabilities are showcased
- [ ] Complete DevSecOps workflow is demonstrated
- [ ] Fix is verified to work correctly

---

**Ready to revolutionize your security workflow with AI? Let's demo the future of DevSecOps! 🚀**