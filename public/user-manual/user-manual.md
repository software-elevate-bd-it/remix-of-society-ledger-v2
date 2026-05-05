# Somitee HQ — User Manual

Welcome to **Somitee HQ**, an enterprise-grade Somitee (cooperative savings group) management platform. This manual walks you through every module step-by-step.

---

## 1. Getting Started

### 1.1 Logging In
1. Open the app URL.
2. On the login page, enter your **email/phone** and **password**.
3. Click **Sign In**. You will be redirected to your role-based dashboard.

### 1.2 User Roles
- **Super Admin** — Manages multiple Somitees, global settings, subscriptions.
- **Main User (Owner/Manager)** — Manages members, finances, approvals for one Somitee.
- **Member** — Views own ledger, payments, draw participation.

### 1.3 Switching Language
Click the 🌐 **Language Switcher** in the top header to toggle between **English** and **বাংলা**.

### 1.4 Dark Mode
Click the ☀️ / 🌙 icon in the header to switch themes.

---

## 2. Dashboard

After login, you land on the **Dashboard** showing:
- Total Members, Active Collections, Pending Approvals
- Income vs Expense chart
- Recent activity feed
- Quick action buttons

Use the sidebar to navigate to any module.

---

## 3. Member Management

### 3.1 Register a New Member
1. Sidebar → **Member Registration**
2. Fill: Name, Phone, NID, Address, Photo, Signature, Joining Date, Monthly Subscription.
3. Click **Submit** — request goes to approval queue.

### 3.2 Approve Member Requests
1. Sidebar → **Member Requests** (badge shows pending count)
2. Review the request → click **Approve** or **Reject** with note.

### 3.3 View / Edit Members
- Sidebar → **Leadership** lists all members.
- Click a member to open their **Profile**: ledger, payments, draws, documents.

---

## 4. Collections (Money In)

### 4.1 Daily / Monthly Collection
1. Sidebar → **Collections**
2. Choose member → enter amount, date, method (Cash / bKash / Bank).
3. Add note → **Save** (goes to approval if required).

### 4.2 Bulk / Advanced Collection
- Use **Advanced Collection** to record multiple members at once.

---

## 5. Expenses (Money Out)

1. Sidebar → **Expenses**
2. Add: Category, Amount, Date, Vendor, Receipt (upload).
3. Submit → manager approves.

---

## 6. Bank Accounts & Cash Book

### 6.1 Bank Accounts
- Sidebar → **Bank Accounts** to add bank/mobile-banking accounts, deposits, withdrawals, transfers.

### 6.2 Cash Book
- Sidebar → **Cash Book** shows daily opening, in/out, closing balance.

---

## 7. Ledger

- **Ledger** (Main User) — full double-entry style ledger across all accounts.
- **My Ledger** (Member) — your personal contributions, dues, withdrawals.

---

## 8. Payments

- Sidebar → **Payments** to view scheduled installments, mark as paid, send reminders.

---

## 9. Draw Savings (Lottery / Rotating Pool)

### 9.1 Create a Draw Group
1. Sidebar → **Draw Savings** → **+ New Draw Group**
2. Fill: Group Name, Draw Type (Daily / Weekly / Every 15 Days / Monthly), Start Date, Installment Amount, Max Members, Total Cycles, Draw Method (Random / Manual / Token).
3. **Save** (status: Draft).

### 9.2 Enroll Members
- Open a group → **Members** tab → **Add Member** → choose from existing members.
- Activate the group when enrollment is complete.

### 9.3 Collect Installments
- **Installments** tab → for each cycle, mark members as paid (full / partial / due).

### 9.4 Execute a Draw
1. **Cycles** tab → click **Execute Draw** for the current cycle.
2. System picks a winner (random/manual/auto-final) from eligible members (those who paid and haven't won yet).
3. Winner enters **Pending Approval** state.

### 9.5 Approve / Reject Winner
- **Winners** tab → Approve (winner gets the pot) or Reject (with reason — winner returns to eligible pool).

### 9.6 Load Demo Data
- Click **Load Demo Data** at the top of the page to populate sample groups, members, payments, and winners for testing.

---

## 10. Reports

Sidebar → **Reports** opens a sub-menu:
- **Income vs Expense** — period-wise P&L
- **Cash Flow** — money movement
- **Member Due** — outstanding dues per member
- **Bank vs Cash** — balance distribution
- **Collection Report** — collection summary

Each report supports date filter, export to **PDF / Excel / CSV**, and print.

---

## 11. Approvals Inbox

- Sidebar → **Approvals** — central inbox of all pending items (collections, expenses, bank txns, member requests).
- Click an item → review → **Approve** / **Reject** with note.

---

## 12. SMS Module

- Sidebar → **SMS** to send bulk SMS (due reminders, draw notifications, custom messages).

---

## 13. Users & Roles

### 13.1 Add Sub-User (Manager / Accountant)
- Sidebar → **Users** → **+ Add User** → assign role.

### 13.2 Manage Roles & Permissions
- Sidebar → **Roles** → create custom roles, toggle permissions per module (collection.create, expense.approve, reports.view, etc.).

---

## 14. Settings

Sidebar → **Settings** to configure:
- Company / Somitee profile (name, logo, address, contact)
- Subscription plan & billing
- SMS gateway credentials
- Notification preferences

---

## 15. Branding & Theme Studio

Sidebar → **Theme Studio** — premium live theme builder.

- **Colors**: Primary, Secondary, Accent, Success, Warning, Destructive, Info
- **Sidebar / Header / Login**: per-section color overrides
- **Buttons**: radius, shadow, color, hover
- **Typography**: heading & body fonts (Google Fonts), font size scale, weight
- **Layout**: full-width / boxed, expanded / compact sidebar
- **Presets**: Default, Corporate, Emerald Green, Midnight
- Save / Duplicate / Rename / Export-Import (JSON) themes.
- Changes apply instantly — no refresh needed.

---

## 16. Global Search

- Top header → **Global Search** (or press `Ctrl/Cmd + K`).
- Search across members, payments, expenses, groups in one box.

---

## 17. Notifications

- 🔔 Bell icon in the header shows recent activity, approval requests, and system alerts.

---

## 18. FAQ & Help

- Sidebar → **FAQ & Help** for common questions.
- Sidebar → **How to Work the System** (this manual).
- Sidebar → **API Docs** for developer-level REST API reference.

---

## 19. Logout

- Click your avatar (top-right) → **Logout**.

---

## 20. Tips & Best Practices

- ✅ Approve transactions daily to keep ledger clean.
- ✅ Run **Member Due** report weekly and send SMS reminders.
- ✅ Backup themes by exporting JSON before major changes.
- ✅ Use **Roles** to limit data access for sub-users.
- ✅ Always verify the **Cash Book** matches physical cash at day-end.

---

## 21. Support

- 🌐 Website: [www.softwareelevate.com](https://www.softwareelevate.com)
- 📞 Phone: 01922500433
- 💬 WhatsApp: 01312978030
- 📘 Facebook: [facebook.com/profile.php?id=61571454874255](https://facebook.com/profile.php?id=61571454874255)

---

_Powered by Software Elevated — © 2026_
