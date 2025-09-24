🛒 Internal Team IT Hardware Store – Security & Audit Improvements
App Overview
This is a simple internal shopping cart demo for IT hardware, designed to let users add products to a cart, view totals, and checkout. Orders are stored and displayed in an order history page for audit and review.

Current Vulnerability
Critical Issue:
The backend currently trusts the client-supplied total at checkout, allowing users to manipulate the total amount before submitting an order. This means a malicious user can change the total to any value (including zero or negative), and the order will be processed and stored with that amount.

Missing Feature:
There is no mechanism to flag or annotate orders in the order history when the total was manipulated or is otherwise suspicious (e.g., zero/negative/very low amounts).

Tasks for Copilot Coding Agent
1. Add Order Notes/Flagging System
Add a notes column to the orders table in the database.
On checkout, compare the client-supplied total to the server-calculated total (sum of cart items).
If the totals do not match, or if the total is zero/negative/very low, store a flag or note in the notes column (e.g., “🚩 Client-modified total”, “🚨 Zero/Negative amount”).
Update the order history UI to display the notes column, so suspicious orders are clearly visible.
2. Fix Checkout Calculation Vulnerability
Refactor the checkout endpoint so the server always calculates the order total based on the cart contents, ignoring any client-supplied total.
Only allow orders to be created with the correct, server-calculated total.
Acceptance Criteria
Orders with manipulated or suspicious totals are flagged in the order history.
The checkout process is secure and does not trust any client-supplied total.
The order history UI clearly displays any notes or flags for each order.
Assigning:
@github-copilot-coding-agent

Let me know if you want to further tailor the wording or add more technical detail!