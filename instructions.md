# Instructions for Copilot Agent and Contributors

## Project Overview
This repository is a demo e-commerce app for internal IT hardware orders. It includes a Node.js/Express backend, a SQLite database, and a static frontend. The project is designed for repeatable demos, with automated deployment and reset workflows.

---

## 1. Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm
- (For deployment/reset) AWS EC2 instance with SSH access

### Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```
3. Access the app at http://localhost:3000

---

## 2. Deployment & Reset (Demo Environment)

### Deploy to EC2
- Trigger the `deploy.yml` GitHub Actions workflow to deploy the current branch to the demo server.
- The workflow uses SSH and rsync to sync code and restarts the app with PM2.

### Reset Demo Environment
- Trigger the `reset-demo.yml` workflow (manual dispatch in GitHub Actions).
- This will:
  1. Sync the EC2 server to the `golden-image` branch (pristine state)
  2. Create a GitHub issue requesting a reset of the `main` branch to match `golden-image` (for Copilot agent or manual action)

---

## 3. Resetting the Main Branch
- When a reset issue is created, use the instructions in `copilot_reset_main_prompt.md` to reset `main` to `golden-image`.
- This can be automated by Copilot agent or done manually by a maintainer.

---

## 4. Troubleshooting
- If the cart or UI is duplicated, check for duplicate HTML blocks in `public/index.html`.
- For log streaming, see commented code in `server.js` (can be re-enabled as needed).
- For workflow errors, check GitHub Actions logs and ensure secrets (e.g., `EC2_SSH_KEY`, `GH_PAT`) are set.

---

## 5. Copilot Agent Tips
- Use the provided workflows for repeatable, auditable demo resets.
- Always check for duplicate markup or scripts if UI issues appear.
- Refer to this file and `README.md` for conventions and automation entry points.

---

## 6. Useful Files
- `.github/workflows/deploy.yml` — Deploy to EC2
- `.github/workflows/reset-demo.yml` — Reset server and create main reset issue
- `copilot_reset_main_prompt.md` — Prompt for main branch reset
- `server.js` — Backend logic
- `public/index.html` — Main frontend page

---

## 7. Contact
For questions or issues, open a GitHub issue or contact the repository owner.
