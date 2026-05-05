export interface HelpArticle {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  notes?: string[];
  faq?: { q: string; a: string }[];
  related?: string[]; // article ids
  videoUrl?: string;
  screenshots?: string[];
  published?: boolean;
}

export interface HelpCategory {
  id: string;
  title: string;
  icon: string; // lucide icon name
  articles: HelpArticle[];
}

const A = (
  id: string,
  title: string,
  summary: string,
  steps: string[],
  extra: Partial<HelpArticle> = {}
): HelpArticle => ({ id, title, summary, steps, published: true, ...extra });

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Sparkles',
    articles: [
      A('welcome', 'Welcome to Somitee HQ',
        'A short tour of what Somitee HQ does and how this guide is organized.',
        [
          'Read this article to understand what Somitee HQ helps you manage.',
          'Browse the left sidebar — every module has its own section.',
          'Use the search bar above to jump to any topic instantly.',
          'Mark articles as completed to track your onboarding progress.',
        ],
        { faq: [{ q: 'Do I need internet?', a: 'Yes, the app runs in your browser and syncs with the cloud.' }] }),
      A('system-overview', 'System Overview',
        'High-level architecture: members, collections, expenses, bank, draws, reports.',
        [
          'Members are people who join your Somitee.',
          'Collections record money received from members.',
          'Expenses record money spent.',
          'Bank Accounts hold balances and movements.',
          'Draw Savings runs lottery / rotating-pool groups.',
          'Reports summarize all the above.',
        ]),
      A('how-to-login', 'How to Login',
        'Sign in to your Somitee HQ workspace.',
        [
          'Open the app URL.',
          'Enter your email or phone.',
          'Enter your password.',
          'Click Sign In.',
          'You will land on your role-based dashboard.',
        ],
        { notes: ['Forgot your password? Use "Forgot Password" on the login screen.'] }),
      A('change-password', 'Change Password',
        'Keep your account secure by updating your password regularly.',
        [
          'Click your avatar in the top-right.',
          'Open Settings → Security.',
          'Enter current password, new password, confirm.',
          'Save changes — you may be asked to re-login.',
        ]),
      A('update-profile', 'Update Profile',
        'Update your display name, photo, phone, and contact info.',
        [
          'Go to Settings → Profile.',
          'Edit fields and upload a new photo.',
          'Click Save.',
        ]),
      A('company-setup', 'Company Setup',
        'Configure your Somitee / company profile.',
        [
          'Go to Settings → Company.',
          'Enter name, logo, address, phone, email.',
          'Set fiscal year start and currency.',
          'Save changes.',
        ]),
      A('theme-setup', 'Theme Setup',
        'Customize colors, fonts, and login branding live.',
        [
          'Open Theme Studio from sidebar.',
          'Pick a preset or customize tokens (Primary, Sidebar, Buttons, etc.).',
          'Changes apply instantly — Save As to keep a named theme.',
        ],
        { related: ['upload-logo', 'change-colors'] }),
    ],
  },
  {
    id: 'members',
    title: 'Member Management',
    icon: 'Users',
    articles: [
      A('add-member', 'Add New Member',
        'Register a new member into your Somitee.',
        [
          'Sidebar → Member Registration.',
          'Fill name, phone, NID, photo, signature, joining date, monthly subscription.',
          'Submit — request goes to approval queue.',
        ]),
      A('edit-member', 'Edit Member',
        'Update an existing member\'s info.',
        [
          'Sidebar → Leadership → click a member.',
          'Click Edit, change fields, Save.',
        ]),
      A('search-members', 'Search Members',
        'Find a member fast using global search or member list filters.',
        [
          'Press Ctrl/Cmd + K to open Global Search.',
          'Type the name, phone, or member ID.',
          'Click the result to open the profile.',
        ]),
      A('member-status', 'Member Status',
        'Active, inactive, suspended — what each status means.',
        [
          'Active: full participation in collections and draws.',
          'Inactive: no new collection until reactivated.',
          'Suspended: temporary block, e.g. due to misconduct.',
        ]),
      A('monthly-fees', 'Monthly Fees',
        'Set and manage recurring monthly subscription per member.',
        [
          'Open the member profile.',
          'Set Monthly Subscription amount.',
          'Payments page will auto-generate monthly installments.',
        ]),
      A('member-reports', 'Member Reports',
        'Outstanding dues, contributions, draw participation.',
        [
          'Sidebar → Reports → Member Due.',
          'Filter by month/range and export.',
        ]),
    ],
  },
  {
    id: 'collections',
    title: 'Collection Management',
    icon: 'Wallet',
    articles: [
      A('collect-payment', 'Collect Payment',
        'Record money received from a member.',
        [
          'Sidebar → Collections.',
          'Choose member, amount, date, method.',
          'Add note → Save.',
        ]),
      A('partial-collection', 'Partial Collection',
        'Record a partial payment when a member can\'t pay full.',
        [
          'Open Collections → New.',
          'Enter the amount actually paid (less than expected).',
          'System marks remaining as Due automatically.',
        ]),
      A('due-management', 'Due Management',
        'Track and reduce outstanding dues.',
        [
          'Run Member Due report.',
          'Send SMS reminders for outstanding members.',
          'Record payments to clear dues.',
        ]),
      A('payment-history', 'Payment History',
        'Per-member full payment history.',
        ['Open member profile → Payments tab → see all transactions.']),
      A('payment-verification', 'Payment Verification',
        'Manager approval before a collection becomes final.',
        [
          'Submitter records collection (status Pending).',
          'Approver opens Approvals inbox.',
          'Approve or reject with note.',
        ]),
    ],
  },
  {
    id: 'draw-savings',
    title: 'Draw Savings Management',
    icon: 'Gift',
    articles: [
      A('create-draw-group', 'Create Draw Group',
        'Set up a new lottery / rotating-pool savings group.',
        [
          'Sidebar → Draw Savings → + New Draw Group.',
          'Fill name, draw type (Daily/Weekly/15days/Monthly), start date, installment, max members, total cycles, draw method.',
          'Save — group starts in Draft.',
        ]),
      A('add-draw-members', 'Add Members to Draw',
        'Enroll members into the group.',
        [
          'Open the group → Members tab.',
          'Click Add Member, select from existing members.',
          'Activate the group when enrollment is complete.',
        ]),
      A('collect-installments', 'Collect Installments',
        'Record per-cycle installments from each member.',
        [
          'Open group → Installments tab.',
          'Mark each member Paid / Partial / Due for the active cycle.',
        ]),
      A('run-draw', 'Run Draw',
        'Execute a draw to pick a winner for the cycle.',
        [
          'Open Cycles tab → click Execute Draw.',
          'System picks random/manual/auto-final winner from eligible members.',
          'Winner enters Pending Approval state.',
        ]),
      A('approve-winners', 'Approve Winners',
        'Owner/Manager confirms or rejects the draw winner.',
        [
          'Winners tab → Approve to release the pot.',
          'Reject with reason — winner returns to eligible pool.',
        ]),
      A('final-winner-logic', 'Final Winner Logic',
        'When only one eligible member remains, they win automatically.',
        [
          'On the last cycle, system detects single eligible member.',
          'Winner is auto-assigned (no random pick) for fairness.',
        ]),
    ],
  },
  {
    id: 'expenses',
    title: 'Expense Management',
    icon: 'Receipt',
    articles: [
      A('add-expense', 'Add Expense', 'Record a business expense.',
        ['Sidebar → Expenses → New.', 'Enter category, amount, date, vendor, receipt.', 'Submit.']),
      A('approve-expense', 'Approve Expense', 'Manager approves submitted expense.',
        ['Approvals inbox → click expense → Approve.']),
      A('reject-expense', 'Reject Expense', 'Reject with reason.',
        ['Approvals inbox → click expense → Reject → enter note → confirm.']),
    ],
  },
  {
    id: 'bank',
    title: 'Bank Management',
    icon: 'Landmark',
    articles: [
      A('add-bank', 'Add Bank Account', 'Add a bank or mobile-banking account.',
        ['Sidebar → Bank Accounts → + Add.', 'Fill bank name, account number, opening balance, type.', 'Save.']),
      A('deposit-money', 'Deposit Money', 'Move cash into a bank account.',
        ['Bank Accounts → choose account → Deposit.', 'Enter amount, date, source.', 'Save.']),
      A('withdraw-money', 'Withdraw Money', 'Take money out of a bank account.',
        ['Bank Accounts → Withdraw → enter amount, purpose, date.', 'Save.']),
      A('transfer-money', 'Transfer Money', 'Move funds between accounts.',
        ['Bank Accounts → Transfer → choose source and destination → amount.', 'Save.']),
    ],
  },
  {
    id: 'ledger',
    title: 'Ledger',
    icon: 'BookOpen',
    articles: [
      A('view-ledger', 'View Ledger', 'Open the full ledger.',
        ['Sidebar → Ledger.', 'Filter by date range, account, type.']),
      A('debit-credit', 'Debit and Credit', 'Understand entry direction.',
        ['Money in = Credit (income / collection).', 'Money out = Debit (expense / withdrawal).']),
      A('balance-tracking', 'Balance Tracking', 'See running balance per account.',
        ['Open Cash Book or Bank Accounts.', 'Each row shows running balance.']),
    ],
  },
  {
    id: 'approval',
    title: 'Approval Workflow',
    icon: 'CheckCircle2',
    articles: [
      A('submit-approval', 'Submit for Approval', 'How items enter the approval queue.',
        ['Create transaction (collection/expense/bank).', 'It auto-routes to approvers based on role.']),
      A('approve-request', 'Approve Request', 'Approve a pending item.',
        ['Sidebar → Approvals.', 'Click item → Approve.']),
      A('reject-with-note', 'Reject with Note', 'Reject with mandatory reason.',
        ['Approvals → click item → Reject.', 'Enter clear reason → confirm.']),
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'BarChart3',
    articles: [
      A('daily-reports', 'Daily Reports', 'Day-end snapshot of cash, collections, expenses.',
        ['Reports → Cash Flow → set date = today.', 'Export PDF/Excel.']),
      A('monthly-reports', 'Monthly Reports', 'Month-end income vs expense.',
        ['Reports → Income vs Expense → choose month.', 'Export.']),
      A('financial-summary', 'Financial Summary', 'Combined snapshot.',
        ['Open the main Reports page for combined widgets.']),
    ],
  },
  {
    id: 'roles',
    title: 'User Roles',
    icon: 'ShieldCheck',
    articles: [
      A('create-role', 'Create Role', 'Define a new role (e.g. Accountant).',
        ['Sidebar → Roles → + New.', 'Name + description → Save.']),
      A('assign-permissions', 'Assign Permissions', 'Toggle module permissions per role.',
        ['Open the role → check permissions like collection.create, reports.view.', 'Save.']),
      A('manage-access', 'Manage Access', 'Assign roles to users.',
        ['Sidebar → Users → edit user → assign role(s).']),
    ],
  },
  {
    id: 'theme',
    title: 'Branding & Theme Studio',
    icon: 'Palette',
    articles: [
      A('upload-logo', 'Upload Logo', 'Set your Somitee logo.',
        ['Settings → Company → upload logo (PNG/SVG).', 'Save.']),
      A('change-colors', 'Change Colors', 'Customize primary, sidebar, button, login colors.',
        ['Sidebar → Theme Studio.', 'Use color pickers.', 'Save As theme.']),
      A('login-branding', 'Login Branding', 'Customize the login screen look.',
        ['Theme Studio → Login section → set background, gradient, button color, hero image URL.']),
    ],
  },
  {
    id: 'sms',
    title: 'SMS Settings',
    icon: 'MessageSquare',
    articles: [
      A('setup-sms', 'Setup SMS Provider', 'Connect your SMS gateway.',
        ['Settings → SMS → enter API key, sender ID.', 'Save and send test SMS.']),
      A('payment-alerts', 'Payment Alerts', 'Auto-send SMS on payment received.',
        ['SMS settings → enable Payment Confirmation template.']),
      A('reminder-setup', 'Reminder Setup', 'Schedule due reminders.',
        ['SMS → Reminders → choose schedule (e.g. 3 days before due).']),
    ],
  },
];

export function findArticle(id: string) {
  for (const c of helpCategories) {
    const a = c.articles.find((x) => x.id === id);
    if (a) return { article: a, category: c };
  }
  return null;
}

export function allArticles() {
  return helpCategories.flatMap((c) => c.articles.map((a) => ({ ...a, categoryId: c.id, categoryTitle: c.title })));
}
