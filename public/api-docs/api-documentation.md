# SomiteeHQ API Documentation

> **Base URL:** `https://api.somiteehq.com/v1`
> **Version:** 1.0.0
> **Auth:** Bearer Token (JWT)

---

## Standard Response Format

### ✅ Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### ❌ Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### TypeScript Types

```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errors: FieldError[];
}

interface FieldError {
  field: string;
  message: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Query Params for paginated endpoints
interface PaginationParams {
  page?: number;       // default: 1
  limit?: number;      // default: 10
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Request successful |
| 201 | Created — Resource created |
| 400 | Bad Request — Validation error |
| 401 | Unauthorized — Invalid/missing token |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource not found |
| 409 | Conflict — Duplicate resource |
| 422 | Unprocessable Entity — Business logic error |
| 500 | Internal Server Error |

---

## Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <token>` | Yes (except auth endpoints) |
| `Accept-Language` | `en` or `bn` | Optional |

---

# 🔐 Authentication

## POST `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "manager@somitee.com",
  "password": "manager123"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-123",
      "name": "Rahim Uddin",
      "email": "manager@somitee.com",
      "role": "main_user",
      "somiteeId": "s1",
      "someiteeName": "Banani Market Somitee",
      "profilePhoto": null
    },
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "expiresIn": 3600
  }
}
```

**❌ 401 Unauthorized:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "errors": []
}
```

---

## POST `/auth/register`

Register a new somitee manager account.

**Request Body:**
```json
{
  "name": "New Manager",
  "email": "new@somitee.com",
  "password": "securePass123",
  "phone": "01700000000",
  "somiteeName": "New Market Somitee"
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-456",
      "name": "New Manager",
      "email": "new@somitee.com",
      "role": "main_user",
      "somiteeId": "s-new",
      "someiteeName": "New Market Somitee"
    },
    "token": "eyJhbGciOi..."
  }
}
```

**❌ 409 Conflict:**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already registered",
  "errors": [
    { "field": "email", "message": "This email is already in use" }
  ]
}
```

---

## POST `/auth/forgot-password`

Send password reset link.

**Request Body:**
```json
{
  "email": "manager@somitee.com"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset link sent to your email",
  "data": null
}
```

**❌ 404 Not Found:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "No account found with this email",
  "errors": []
}
```

---

## POST `/auth/reset-password`

Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-xyz",
  "newPassword": "newSecurePass123"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successful",
  "data": null
}
```

**❌ 400 Bad Request:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid or expired reset token",
  "errors": [
    { "field": "token", "message": "Token has expired" }
  ]
}
```

---

## POST `/auth/refresh-token`

Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "expiresIn": 3600
  }
}
```

---

## POST `/auth/logout`

Invalidate current session.

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

---

## GET `/auth/me`

Get current authenticated user profile.

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid-123",
    "name": "Rahim Uddin",
    "email": "manager@somitee.com",
    "role": "main_user",
    "phone": "01711111111",
    "profilePhoto": "https://cdn.somiteehq.com/photos/uuid-123.jpg",
    "somiteeId": "s1",
    "someiteeName": "Banani Market Somitee"
  }
}
```

---

# 👥 Members

## GET `/members`

List all members with pagination. **Role:** `main_user`

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | — | Search by name, phone, shop |
| status | string | — | `active` or `inactive` |
| sortBy | string | `name` | Sort field |
| sortOrder | string | `asc` | `asc` or `desc` |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Members retrieved",
  "data": [
    {
      "id": "m1",
      "name": "Karim Mia",
      "shopName": "Karim Electronics",
      "phone": "01712345678",
      "address": "Shop 12, Banani Market",
      "nid": "1234567890",
      "photo": "https://cdn.somiteehq.com/members/m1.jpg",
      "status": "active",
      "somiteeId": "s1",
      "joinDate": "2024-01-15",
      "monthlyFee": 500,
      "totalDue": 1000,
      "totalPaid": 5000,
      "paymentLink": "https://pay.somiteehq.com/pay-karim-m1"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## GET `/members/:id`

Get single member details. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Member retrieved",
  "data": {
    "id": "m1",
    "name": "Karim Mia",
    "shopName": "Karim Electronics",
    "phone": "01712345678",
    "address": "Shop 12, Banani Market",
    "nid": "1234567890",
    "photo": "https://cdn.somiteehq.com/members/m1.jpg",
    "status": "active",
    "somiteeId": "s1",
    "joinDate": "2024-01-15",
    "monthlyFee": 500,
    "totalDue": 1000,
    "totalPaid": 5000,
    "paymentLink": "https://pay.somiteehq.com/pay-karim-m1",
    "ledger": [],
    "paymentHistory": [],
    "dueHistory": []
  }
}
```

**❌ 404 Not Found:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Member not found",
  "errors": []
}
```

---

## POST `/members`

Create a new member. **Role:** `main_user`

**Request Body:**
```json
{
  "name": "New Member",
  "shopName": "New Shop",
  "phone": "01700000000",
  "address": "Shop 25, Banani Market",
  "nid": "1122334455",
  "monthlyFee": 500,
  "password": "",
  "photo": null
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Member created successfully",
  "data": {
    "id": "m-new",
    "name": "New Member",
    "shopName": "New Shop",
    "phone": "01700000000",
    "address": "Shop 25, Banani Market",
    "nid": "1122334455",
    "status": "active",
    "somiteeId": "s1",
    "joinDate": "2026-04-11",
    "monthlyFee": 500,
    "totalDue": 0,
    "totalPaid": 0,
    "paymentLink": "https://pay.somiteehq.com/pay-new-m-new",
    "autoGeneratedPassword": "Xk9mQ2pL"
  }
}
```

**❌ 400 Validation Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "phone", "message": "Phone must be a valid Bangladesh number" }
  ]
}
```

---

## PUT `/members/:id`

Update member details. **Role:** `main_user`

**Request Body:**
```json
{
  "name": "Karim Mia Updated",
  "shopName": "Karim Electronics Pro",
  "phone": "01712345678",
  "address": "Shop 12A, Banani Market",
  "monthlyFee": 600,
  "status": "active"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Member updated successfully",
  "data": {
    "id": "m1",
    "name": "Karim Mia Updated",
    "shopName": "Karim Electronics Pro",
    "phone": "01712345678",
    "address": "Shop 12A, Banani Market",
    "monthlyFee": 600,
    "status": "active"
  }
}
```

---

## DELETE `/members/:id`

Delete a member. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Member deleted successfully",
  "data": null
}
```

**❌ 422 Unprocessable:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Cannot delete member with pending dues",
  "errors": [
    { "field": "totalDue", "message": "Member has ৳1000 pending dues" }
  ]
}
```

---

## GET `/members/:id/ledger`

Get member's ledger entries. **Role:** `main_user`, `member`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |
| dateFrom | string | — |
| dateTo | string | — |
| type | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Ledger entries retrieved",
  "data": [
    {
      "id": "l1",
      "date": "2024-12-01",
      "description": "Monthly Fee - December 2024",
      "type": "credit",
      "amount": 500,
      "balance": 5000,
      "reference": "t1"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

## GET `/members/:id/payment-history`

Get member's payment history. **Role:** `main_user`, `member`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment history retrieved",
  "data": [
    {
      "id": "t1",
      "date": "2024-12-01",
      "amount": 500,
      "method": "cash",
      "status": "approved",
      "category": "Monthly Fee",
      "transactionId": null,
      "receiptUrl": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## GET `/members/:id/due-history`

Get member's due breakdown. **Role:** `main_user`, `member`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Due history retrieved",
  "data": [
    {
      "month": "2024-12",
      "fee": 500,
      "paid": 500,
      "due": 0,
      "status": "paid"
    },
    {
      "month": "2025-01",
      "fee": 500,
      "paid": 0,
      "due": 500,
      "status": "unpaid"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 12,
    "totalPages": 1
  }
}
```

---

## GET `/members/:id/report`

Download member report. **Role:** `main_user`

**Query Params:**
| Param | Type | Options |
|-------|------|---------|
| format | string | `pdf`, `csv` |

**✅ 200 Success (binary file download):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="member-karim-mia-report.pdf"
```

---

## POST `/members/:id/upload-photo`

Upload member profile photo. **Role:** `main_user`

**Request:** `multipart/form-data`
| Field | Type |
|-------|------|
| photo | File (jpg/png, max 2MB) |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Photo uploaded successfully",
  "data": {
    "photoUrl": "https://cdn.somiteehq.com/members/m1-updated.jpg"
  }
}
```

---

# 💰 Collections (Income)

## GET `/collections`

List all collections. **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 10 |
| search | string | — |
| status | string | — |
| method | string | — |
| category | string | — |
| dateFrom | string | — |
| dateTo | string | — |
| memberId | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collections retrieved",
  "data": [
    {
      "id": "t1",
      "memberId": "m1",
      "memberName": "Karim Mia",
      "type": "collection",
      "amount": 500,
      "date": "2024-12-01",
      "category": "Monthly Fee",
      "method": "cash",
      "status": "approved",
      "note": null,
      "transactionId": null,
      "receiptUrl": null,
      "createdAt": "2024-12-01T10:00:00Z",
      "approvedBy": "uuid-123",
      "approvedAt": "2024-12-01T10:05:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## POST `/collections`

Record a new collection. **Role:** `main_user`

**Request Body:**
```json
{
  "memberId": "m1",
  "amount": 500,
  "date": "2024-12-01",
  "category": "Monthly Fee",
  "method": "bkash",
  "transactionId": "BK12345",
  "note": "December payment"
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Collection recorded successfully",
  "data": {
    "id": "t-new",
    "memberId": "m1",
    "memberName": "Karim Mia",
    "type": "collection",
    "amount": 500,
    "date": "2024-12-01",
    "category": "Monthly Fee",
    "method": "bkash",
    "status": "pending",
    "transactionId": "BK12345",
    "note": "December payment"
  }
}
```

**❌ 400 Validation Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "memberId", "message": "Member is required" },
    { "field": "amount", "message": "Amount must be greater than 0" },
    { "field": "transactionId", "message": "Transaction ID is required for bKash/Nagad/Bank payments" }
  ]
}
```

---

## PUT `/collections/:id`

Update a collection. **Role:** `main_user`

**Request Body:**
```json
{
  "amount": 600,
  "note": "Updated amount"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collection updated successfully",
  "data": {
    "id": "t1",
    "amount": 600,
    "note": "Updated amount"
  }
}
```

---

## DELETE `/collections/:id`

Delete a collection. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collection deleted successfully",
  "data": null
}
```

---

## PATCH `/collections/:id/status`

Approve or reject a collection. **Role:** `main_user`

**Request Body:**
```json
{
  "status": "approved",
  "note": "Verified via bKash statement"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Collection approved successfully",
  "data": {
    "id": "t3",
    "status": "approved",
    "approvedBy": "uuid-123",
    "approvedAt": "2026-04-11T14:30:00Z"
  }
}
```

---

## POST `/collections/public-pay/:paymentLink`

Public payment endpoint (no auth). Member pays via SSLCommerz.

**Request Body:**
```json
{
  "amount": 500,
  "method": "sslcommerz",
  "month": "2025-01"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment initiated",
  "data": {
    "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/api.php?...",
    "sessionKey": "ssl-session-xyz"
  }
}
```

---

## POST `/collections/public-pay/callback`

SSLCommerz IPN callback (server-to-server).

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment confirmed",
  "data": {
    "collectionId": "t-ssl-1",
    "transactionId": "SSL98765",
    "status": "approved"
  }
}
```

---

# 💸 Expenses

## GET `/expenses`

List all expenses. **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 10 |
| category | string | — |
| dateFrom | string | — |
| dateTo | string | — |
| amountMin | number | — |
| amountMax | number | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Expenses retrieved",
  "data": [
    {
      "id": "t5",
      "memberId": null,
      "memberName": null,
      "type": "expense",
      "amount": 2000,
      "date": "2024-12-05",
      "category": "Maintenance",
      "method": "bank",
      "status": "approved",
      "note": "Market cleaning",
      "receiptUrl": null,
      "createdAt": "2024-12-05T09:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

---

## POST `/expenses`

Record a new expense. **Role:** `main_user`

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2024-12-10",
  "category": "Electricity",
  "method": "bank",
  "note": "Monthly electricity bill",
  "receipt": null
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Expense recorded successfully",
  "data": {
    "id": "t-exp-new",
    "type": "expense",
    "amount": 5000,
    "date": "2024-12-10",
    "category": "Electricity",
    "method": "bank",
    "status": "approved",
    "note": "Monthly electricity bill"
  }
}
```

---

## PUT `/expenses/:id`

Update an expense. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Expense updated successfully",
  "data": {
    "id": "t5",
    "amount": 2500,
    "category": "Maintenance",
    "note": "Market cleaning - updated"
  }
}
```

---

## DELETE `/expenses/:id`

Delete an expense. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Expense deleted successfully",
  "data": null
}
```

---

## GET `/expenses/categories`

Get all expense categories. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved",
  "data": [
    "Maintenance",
    "Electricity",
    "Water",
    "Security",
    "Cleaning",
    "Repair",
    "Office Supplies",
    "Transport",
    "Other"
  ]
}
```

---

# 📒 Ledger

## GET `/ledger`

Get somitee-wide ledger. **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |
| dateFrom | string | — |
| dateTo | string | — |
| type | string | — |
| memberId | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Ledger entries retrieved",
  "data": [
    {
      "id": "led-1",
      "date": "2024-12-01",
      "description": "Monthly Fee - Karim Mia",
      "type": "income",
      "debit": 0,
      "credit": 500,
      "balance": 500,
      "referenceType": "collection",
      "referenceId": "t1",
      "memberId": "m1",
      "memberName": "Karim Mia"
    },
    {
      "id": "led-2",
      "date": "2024-12-05",
      "description": "Market cleaning",
      "type": "expense",
      "debit": 2000,
      "credit": 0,
      "balance": -1500,
      "referenceType": "expense",
      "referenceId": "t5",
      "memberId": null,
      "memberName": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

## GET `/ledger/summary`

Get ledger summary. **Role:** `main_user`

**Query Params:**
| Param | Type |
|-------|------|
| dateFrom | string |
| dateTo | string |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Ledger summary retrieved",
  "data": {
    "totalIncome": 25000,
    "totalExpense": 7000,
    "netBalance": 18000,
    "openingBalance": 0,
    "closingBalance": 18000,
    "period": {
      "from": "2024-12-01",
      "to": "2024-12-31"
    }
  }
}
```

---

# 📖 Cash Book

## GET `/cashbook`

Get cash book entries. **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |
| dateFrom | string | — |
| dateTo | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cash book entries retrieved",
  "data": [
    {
      "id": "cb-1",
      "date": "2024-12-01",
      "description": "Cash collection - Karim Mia",
      "cashIn": 500,
      "cashOut": 0,
      "balance": 500,
      "referenceType": "collection",
      "referenceId": "t1"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "totalPages": 2
  }
}
```

---

## GET `/cashbook/summary`

Get cash book summary. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cash book summary retrieved",
  "data": {
    "totalCashIn": 15000,
    "totalCashOut": 5000,
    "cashInHand": 10000,
    "period": {
      "from": "2024-12-01",
      "to": "2024-12-31"
    }
  }
}
```

---

# 🏦 Bank Accounts

## GET `/bank-accounts`

List all bank accounts. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bank accounts retrieved",
  "data": [
    {
      "id": "b1",
      "bankName": "Sonali Bank",
      "accountName": "Banani Market Somitee",
      "accountNumber": "1234-5678-9012",
      "balance": 150000,
      "openingBalance": 50000,
      "somiteeId": "s1",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## POST `/bank-accounts`

Create a new bank account. **Role:** `main_user`

**Request Body:**
```json
{
  "bankName": "Dutch Bangla Bank",
  "accountName": "Banani Somitee Savings",
  "accountNumber": "5555-6666-7777",
  "openingBalance": 10000
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Bank account created successfully",
  "data": {
    "id": "b-new",
    "bankName": "Dutch Bangla Bank",
    "accountName": "Banani Somitee Savings",
    "accountNumber": "5555-6666-7777",
    "balance": 10000,
    "openingBalance": 10000,
    "somiteeId": "s1"
  }
}
```

---

## PUT `/bank-accounts/:id`

Update bank account details. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bank account updated successfully",
  "data": {
    "id": "b1",
    "bankName": "Sonali Bank",
    "accountName": "Banani Market Somitee Updated"
  }
}
```

---

## DELETE `/bank-accounts/:id`

Delete a bank account. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bank account deleted successfully",
  "data": null
}
```

**❌ 422 Unprocessable:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Cannot delete account with non-zero balance",
  "errors": [
    { "field": "balance", "message": "Account has ৳150,000 balance" }
  ]
}
```

---

## POST `/bank-accounts/:id/deposit`

Deposit to bank account. **Role:** `main_user`

**Request Body:**
```json
{
  "amount": 25000,
  "date": "2024-12-01",
  "note": "Monthly collection deposit",
  "reference": "DEP-001"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Deposit successful",
  "data": {
    "id": "bt-new",
    "bankAccountId": "b1",
    "type": "deposit",
    "amount": 25000,
    "date": "2024-12-01",
    "note": "Monthly collection deposit",
    "reference": "DEP-001",
    "balanceAfter": 175000
  }
}
```

---

## POST `/bank-accounts/:id/withdraw`

Withdraw from bank account. **Role:** `main_user`

**Request Body:**
```json
{
  "amount": 5000,
  "date": "2024-12-05",
  "note": "Electricity bill payment"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Withdrawal successful",
  "data": {
    "id": "bt-new-2",
    "bankAccountId": "b1",
    "type": "withdraw",
    "amount": 5000,
    "date": "2024-12-05",
    "note": "Electricity bill payment",
    "balanceAfter": 145000
  }
}
```

**❌ 422 Insufficient Balance:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Insufficient balance",
  "errors": [
    { "field": "amount", "message": "Requested ৳200,000 but only ৳150,000 available" }
  ]
}
```

---

## POST `/bank-accounts/:id/transfer`

Transfer between bank accounts. **Role:** `main_user`

**Request Body:**
```json
{
  "toAccountId": "b2",
  "amount": 10000,
  "date": "2024-12-12",
  "note": "Transfer to Islami Bank"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Transfer successful",
  "data": {
    "fromTransaction": {
      "id": "bt-tf-1",
      "bankAccountId": "b1",
      "type": "transfer",
      "amount": 10000,
      "balanceAfter": 140000
    },
    "toTransaction": {
      "id": "bt-tf-2",
      "bankAccountId": "b2",
      "type": "deposit",
      "amount": 10000,
      "balanceAfter": 95000
    }
  }
}
```

---

## GET `/bank-accounts/:id/transactions`

Get bank account transactions (Bank Ledger). **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |
| type | string | — |
| dateFrom | string | — |
| dateTo | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bank transactions retrieved",
  "data": [
    {
      "id": "bt1",
      "bankAccountId": "b1",
      "type": "deposit",
      "amount": 25000,
      "date": "2024-12-01",
      "note": "Monthly collection deposit",
      "reference": "DEP-001",
      "balanceAfter": 75000
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

## GET `/bank-accounts/:id/statement`

Download bank statement. **Role:** `main_user`

**Query Params:**
| Param | Type |
|-------|------|
| dateFrom | string |
| dateTo | string |
| format | string |

**✅ 200 Success (binary file):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="bank-statement-sonali-bank-dec-2024.pdf"
```

---

# 💳 Payments (Verification)

## GET `/payments`

List payments pending verification. **Role:** `main_user`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 10 |
| status | string | `pending` |
| method | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payments retrieved",
  "data": [
    {
      "id": "t3",
      "memberId": "m3",
      "memberName": "Rina Begum",
      "amount": 500,
      "date": "2024-12-02",
      "method": "nagad",
      "status": "pending",
      "transactionId": "NG67890",
      "category": "Monthly Fee"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## PATCH `/payments/:id/verify`

Verify (approve/reject) a payment. **Role:** `main_user`

**Request Body:**
```json
{
  "status": "approved",
  "note": "Verified with Nagad statement"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment approved successfully",
  "data": {
    "id": "t3",
    "status": "approved",
    "verifiedBy": "uuid-123",
    "verifiedAt": "2026-04-11T15:00:00Z",
    "note": "Verified with Nagad statement"
  }
}
```

---

# 📊 Reports

## GET `/reports/income-vs-expense`

Income vs Expense report. **Role:** `main_user`

**Query Params:**
| Param | Type |
|-------|------|
| dateFrom | string |
| dateTo | string |
| groupBy | string |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Income vs Expense report generated",
  "data": {
    "summary": {
      "totalIncome": 25000,
      "totalExpense": 7000,
      "netProfit": 18000
    },
    "breakdown": [
      { "month": "2024-12", "income": 25000, "expense": 7000, "net": 18000 }
    ],
    "incomeByCategory": [
      { "category": "Monthly Fee", "amount": 22500 },
      { "category": "Late Fee", "amount": 2500 }
    ],
    "expenseByCategory": [
      { "category": "Electricity", "amount": 5000 },
      { "category": "Maintenance", "amount": 2000 }
    ]
  }
}
```

---

## GET `/reports/cash-flow`

Cash flow report. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cash flow report generated",
  "data": {
    "openingBalance": 50000,
    "closingBalance": 68000,
    "totalInflow": 25000,
    "totalOutflow": 7000,
    "daily": [
      { "date": "2024-12-01", "inflow": 1500, "outflow": 0, "balance": 51500 },
      { "date": "2024-12-05", "inflow": 0, "outflow": 2000, "balance": 49500 }
    ]
  }
}
```

---

## GET `/reports/member-dues`

Member due report. **Role:** `main_user`

**Query Params:**
| Param | Type |
|-------|------|
| status | string |
| sortBy | string |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Member due report generated",
  "data": {
    "totalDue": 3000,
    "membersWithDue": 2,
    "members": [
      {
        "memberId": "m4",
        "name": "Salam Mia",
        "shopName": "Salam Tea Stall",
        "phone": "01612345678",
        "totalDue": 1500,
        "lastPaymentDate": "2024-10-15",
        "monthsOverdue": 3
      },
      {
        "memberId": "m1",
        "name": "Karim Mia",
        "shopName": "Karim Electronics",
        "phone": "01712345678",
        "totalDue": 1000,
        "lastPaymentDate": "2024-12-01",
        "monthsOverdue": 1
      }
    ]
  }
}
```

---

## GET `/reports/bank-vs-cash`

Bank vs Cash comparison report. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bank vs Cash report generated",
  "data": {
    "cashInHand": 10000,
    "totalBankBalance": 235000,
    "totalAssets": 245000,
    "bankAccounts": [
      { "bankName": "Sonali Bank", "accountNumber": "1234-5678-9012", "balance": 150000 },
      { "bankName": "Islami Bank", "accountNumber": "9876-5432-1098", "balance": 85000 }
    ]
  }
}
```

---

## GET `/reports/export`

Export any report. **Role:** `main_user`

**Query Params:**
| Param | Type | Options |
|-------|------|---------|
| type | string | `income-expense`, `cash-flow`, `member-dues`, `bank-cash` |
| format | string | `pdf`, `csv`, `excel` |
| dateFrom | string | — |
| dateTo | string | — |
| includeLogo | boolean | `true` |
| includeSignature | boolean | `true` |

**✅ 200 Success (binary file):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="income-expense-report-dec-2024.pdf"
```

---

# 📱 SMS

## GET `/sms/templates`

List SMS templates. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "SMS templates retrieved",
  "data": [
    {
      "id": "sms-t1",
      "name": "Payment Received",
      "body": "Dear {{name}}, your payment of ৳{{amount}} has been received. Thank you! - {{somiteeName}}",
      "variables": ["name", "amount", "somiteeName"],
      "type": "auto"
    },
    {
      "id": "sms-t2",
      "name": "Due Reminder",
      "body": "Dear {{name}}, you have ৳{{due}} pending for {{month}}. Please pay soon. - {{somiteeName}}",
      "variables": ["name", "due", "month", "somiteeName"],
      "type": "auto"
    }
  ]
}
```

---

## POST `/sms/send`

Send SMS to members. **Role:** `main_user`

**Request Body:**
```json
{
  "templateId": "sms-t2",
  "recipientType": "selected",
  "memberIds": ["m1", "m4"],
  "customMessage": null
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "SMS sent to 2 members",
  "data": {
    "sent": 2,
    "failed": 0,
    "results": [
      { "memberId": "m1", "phone": "01712345678", "status": "sent" },
      { "memberId": "m4", "phone": "01612345678", "status": "sent" }
    ]
  }
}
```

---

## POST `/sms/send-custom`

Send custom SMS. **Role:** `main_user`

**Request Body:**
```json
{
  "recipientType": "all",
  "message": "Meeting tomorrow at 4 PM. All members please attend."
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "SMS sent to 45 members",
  "data": {
    "sent": 43,
    "failed": 2,
    "results": []
  }
}
```

---

## GET `/sms/history`

Get SMS send history. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "SMS history retrieved",
  "data": [
    {
      "id": "sms-h1",
      "date": "2024-12-01T10:00:00Z",
      "template": "Due Reminder",
      "recipients": 5,
      "sent": 5,
      "failed": 0,
      "cost": 2.5
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

---

## PUT `/sms/config`

Update SMS gateway configuration. **Role:** `main_user`

**Request Body:**
```json
{
  "provider": "bulksmsbd",
  "apiKey": "your-api-key",
  "senderId": "SomiteeHQ",
  "autoSendOnPayment": true,
  "autoSendDueReminder": true,
  "reminderDayOfMonth": 5
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "SMS configuration updated",
  "data": {
    "provider": "bulksmsbd",
    "senderId": "SomiteeHQ",
    "autoSendOnPayment": true,
    "autoSendDueReminder": true,
    "reminderDayOfMonth": 5
  }
}
```

---

# ⚙️ Settings

## GET `/settings/profile`

Get user profile. **Role:** `all`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved",
  "data": {
    "id": "uuid-123",
    "name": "Rahim Uddin",
    "email": "manager@somitee.com",
    "phone": "01711111111",
    "profilePhoto": "https://cdn.somiteehq.com/photos/uuid-123.jpg"
  }
}
```

---

## PUT `/settings/profile`

Update user profile. **Role:** `all`

**Request Body:**
```json
{
  "name": "Rahim Uddin Updated",
  "phone": "01711111112"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-123",
    "name": "Rahim Uddin Updated",
    "phone": "01711111112"
  }
}
```

---

## PUT `/settings/password`

Change password. **Role:** `all`

**Request Body:**
```json
{
  "currentPassword": "manager123",
  "newPassword": "newSecure456"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

**❌ 400 Wrong Password:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Current password is incorrect",
  "errors": [
    { "field": "currentPassword", "message": "Password does not match" }
  ]
}
```

---

## GET `/settings/company`

Get company settings. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Company settings retrieved",
  "data": {
    "companyName": "Banani Market Somitee",
    "logo": "https://cdn.somiteehq.com/logos/s1.png",
    "address": "Banani, Dhaka-1213",
    "phone": "01711111111",
    "email": "info@bananisomitee.com",
    "signatureImage": "https://cdn.somiteehq.com/signatures/s1.png"
  }
}
```

---

## PUT `/settings/company`

Update company settings. **Role:** `main_user`

**Request Body:**
```json
{
  "companyName": "Banani Market Somitee",
  "address": "Banani Road 11, Dhaka-1213",
  "phone": "01711111111"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Company settings updated successfully",
  "data": {
    "companyName": "Banani Market Somitee",
    "address": "Banani Road 11, Dhaka-1213",
    "phone": "01711111111"
  }
}
```

---

## POST `/settings/company/upload-logo`

Upload company logo. **Role:** `main_user`

**Request:** `multipart/form-data`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logo uploaded successfully",
  "data": {
    "logoUrl": "https://cdn.somiteehq.com/logos/s1-updated.png"
  }
}
```

---

## POST `/settings/company/upload-signature`

Upload signature image. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Signature uploaded successfully",
  "data": {
    "signatureUrl": "https://cdn.somiteehq.com/signatures/s1-updated.png"
  }
}
```

---

## GET `/settings/print-template`

Get print layout template. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Print template retrieved",
  "data": {
    "showLogo": true,
    "showCompanyName": true,
    "showSignature": true,
    "showFooterNotes": true,
    "footerNotes": "This is a computer-generated document",
    "marginTop": 20,
    "marginBottom": 20,
    "marginLeft": 15,
    "marginRight": 15,
    "paperSize": "A4",
    "orientation": "portrait"
  }
}
```

---

## PUT `/settings/print-template`

Update print layout template. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Print template updated successfully",
  "data": {
    "showLogo": true,
    "showCompanyName": true,
    "showSignature": false,
    "marginTop": 25
  }
}
```

---

# 🏢 Somitees (Super Admin)

## GET `/admin/somitees`

List all somitees. **Role:** `super_admin`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 10 |
| search | string | — |
| status | string | — |
| plan | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Somitees retrieved",
  "data": [
    {
      "id": "s1",
      "name": "Banani Market Somitee",
      "managerName": "Rahim Uddin",
      "email": "rahim@banani.com",
      "phone": "01711111111",
      "totalMembers": 45,
      "status": "active",
      "plan": "premium",
      "createdAt": "2024-01-01",
      "monthlyRevenue": 22500,
      "lastActivity": "2026-04-10T18:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

---

## GET `/admin/somitees/:id`

Get somitee details. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Somitee details retrieved",
  "data": {
    "id": "s1",
    "name": "Banani Market Somitee",
    "managerName": "Rahim Uddin",
    "email": "rahim@banani.com",
    "phone": "01711111111",
    "totalMembers": 45,
    "status": "active",
    "plan": "premium",
    "createdAt": "2024-01-01",
    "stats": {
      "totalCollections": 250000,
      "totalExpenses": 70000,
      "bankBalance": 235000,
      "cashInHand": 10000
    }
  }
}
```

---

## POST `/admin/somitees`

Create a new somitee. **Role:** `super_admin`

**Request Body:**
```json
{
  "name": "New Market Somitee",
  "managerName": "Manager Name",
  "email": "manager@new.com",
  "phone": "01700000000",
  "plan": "basic"
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Somitee created successfully",
  "data": {
    "id": "s-new",
    "name": "New Market Somitee",
    "status": "active",
    "plan": "basic"
  }
}
```

---

## PUT `/admin/somitees/:id`

Update somitee. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Somitee updated successfully",
  "data": {
    "id": "s1",
    "name": "Banani Market Somitee Updated"
  }
}
```

---

## PATCH `/admin/somitees/:id/status`

Block/unblock a somitee. **Role:** `super_admin`

**Request Body:**
```json
{
  "status": "blocked",
  "reason": "Subscription expired"
}
```

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Somitee blocked successfully",
  "data": {
    "id": "s3",
    "status": "blocked",
    "blockedAt": "2026-04-11T16:00:00Z",
    "reason": "Subscription expired"
  }
}
```

---

## DELETE `/admin/somitees/:id`

Delete a somitee. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Somitee deleted successfully",
  "data": null
}
```

---

# 📊 Platform Analytics (Super Admin)

## GET `/admin/analytics/overview`

Platform overview stats. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Analytics overview retrieved",
  "data": {
    "totalSomitees": 4,
    "activeSomitees": 3,
    "totalMembers": 165,
    "totalTransactions": 450000,
    "platformRevenue": 25000,
    "growth": {
      "somitees": "+2 this month",
      "members": "+12 this month",
      "revenue": "+8%"
    }
  }
}
```

---

## GET `/admin/analytics/revenue`

Platform revenue analytics. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Revenue analytics retrieved",
  "data": {
    "totalRevenue": 150000,
    "monthly": [
      { "month": "2024-07", "revenue": 15000 },
      { "month": "2024-08", "revenue": 18000 },
      { "month": "2024-09", "revenue": 20000 }
    ],
    "byPlan": [
      { "plan": "premium", "somitees": 2, "revenue": 20000 },
      { "plan": "basic", "somitees": 1, "revenue": 5000 },
      { "plan": "free", "somitees": 1, "revenue": 0 }
    ]
  }
}
```

---

# 💬 Subscriptions (Super Admin)

## GET `/admin/subscriptions/plans`

List subscription plans. **Role:** `super_admin`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Plans retrieved",
  "data": [
    {
      "id": "plan-free",
      "name": "Free",
      "price": 0,
      "maxMembers": 10,
      "features": ["Basic accounting", "5 SMS/month"],
      "status": "active"
    },
    {
      "id": "plan-basic",
      "name": "Basic",
      "price": 500,
      "maxMembers": 50,
      "features": ["Full accounting", "50 SMS/month", "Reports"],
      "status": "active"
    },
    {
      "id": "plan-premium",
      "name": "Premium",
      "price": 1500,
      "maxMembers": -1,
      "features": ["Unlimited members", "Unlimited SMS", "All reports", "Priority support"],
      "status": "active"
    }
  ]
}
```

---

# ❓ FAQ

## GET `/faq`

List FAQs. **Role:** `all`

**Query Params:**
| Param | Type |
|-------|------|
| category | string |
| search | string |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "FAQs retrieved",
  "data": [
    {
      "id": "f1",
      "question": "How do I add a new member?",
      "answer": "Go to Members page and click 'Add Member' button. Fill in the required fields and submit.",
      "category": "Members"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## POST `/faq`

Create FAQ. **Role:** `super_admin`, `main_user`

**Request Body:**
```json
{
  "question": "How to export reports?",
  "answer": "Go to Reports, select type, apply filters, click Export button.",
  "category": "Reports"
}
```

**✅ 201 Created:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "FAQ created successfully",
  "data": {
    "id": "f-new",
    "question": "How to export reports?",
    "answer": "Go to Reports, select type, apply filters, click Export button.",
    "category": "Reports"
  }
}
```

---

## PUT `/faq/:id`

Update FAQ. **Role:** `super_admin`, `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "FAQ updated successfully",
  "data": {
    "id": "f1",
    "question": "How do I add a new member?",
    "answer": "Updated answer here."
  }
}
```

---

## DELETE `/faq/:id`

Delete FAQ. **Role:** `super_admin`, `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "FAQ deleted successfully",
  "data": null
}
```

---

# 🔔 Notifications

## GET `/notifications`

Get user notifications. **Role:** `all`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notifications retrieved",
  "data": [
    {
      "id": "n1",
      "type": "payment_received",
      "title": "Payment Received",
      "message": "Karim Mia paid ৳500 via bKash",
      "read": false,
      "createdAt": "2026-04-11T10:00:00Z",
      "actionUrl": "/collections"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

## PATCH `/notifications/:id/read`

Mark notification as read. **Role:** `all`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Notification marked as read",
  "data": { "id": "n1", "read": true }
}
```

---

## PATCH `/notifications/read-all`

Mark all as read. **Role:** `all`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All notifications marked as read",
  "data": { "updated": 3 }
}
```

---

# 📝 Activity Log

## GET `/activity-log`

Get activity log. **Role:** `main_user`, `super_admin`

**Query Params:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 20 |
| action | string | — |
| userId | string | — |
| dateFrom | string | — |
| dateTo | string | — |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Activity log retrieved",
  "data": [
    {
      "id": "act-1",
      "userId": "uuid-123",
      "userName": "Rahim Uddin",
      "action": "member.create",
      "description": "Created member Karim Mia",
      "metadata": { "memberId": "m1" },
      "ipAddress": "103.12.45.67",
      "createdAt": "2026-04-11T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 🔍 Global Search

## GET `/search`

Global search across entities. **Role:** `main_user`

**Query Params:**
| Param | Type |
|-------|------|
| q | string |
| limit | number |

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Search results",
  "data": {
    "members": [
      { "id": "m1", "name": "Karim Mia", "shopName": "Karim Electronics", "phone": "01712345678" }
    ],
    "transactions": [
      { "id": "t2", "memberName": "Jamal Hossain", "amount": 500, "transactionId": "BK12345" }
    ],
    "bankAccounts": []
  }
}
```

---

# 🌐 Dashboard Stats

## GET `/dashboard/stats`

Get dashboard statistics. **Role:** `main_user`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard stats retrieved",
  "data": {
    "todayCollection": 2500,
    "pendingDue": 3000,
    "totalBankBalance": 235000,
    "cashInHand": 10000,
    "totalMembers": 45,
    "activeMembers": 41,
    "monthlyIncome": 25000,
    "monthlyExpense": 7000,
    "pendingPayments": 5,
    "recentTransactions": []
  }
}
```

---

## GET `/dashboard/member-stats`

Get member dashboard stats. **Role:** `member`

**✅ 200 Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Member dashboard stats retrieved",
  "data": {
    "totalPaid": 5000,
    "totalDue": 1000,
    "lastPaymentDate": "2024-12-01",
    "lastPaymentAmount": 500,
    "monthlyFee": 500,
    "paymentLink": "https://pay.somiteehq.com/pay-karim-m1",
    "recentPayments": []
  }
}
```

---

> **Document Version:** 1.0.0
> **Last Updated:** 2026-04-11
> **Total Endpoints:** 65+
> **Contact:** api@somiteehq.com
