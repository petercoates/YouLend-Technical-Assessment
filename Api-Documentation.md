# API Documentation

## Base URL
```
http://localhost:5103/api/loans
```

## Endpoints

### 1. Create a New Loan
**POST** `/api/loans`

Creates a new loan record in the system.

**Request Body:**
```json
{
  "borrowerName": "Peter Coates",
  "fundingAmount": 50000.00,
  "repaymentAmount": 55000.00
}
```

**Response:** `201 Created`
```json
{
  "loanId": "a1b2c3d4-e5f6-4789-a012-3456789abcde",
  "borrowerName": "Peter Coates",
  "fundingAmount": 50000.00,
  "repaymentAmount": 55000.00,
  "createdAt": "2026-01-11T10:30:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:5103/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "borrowerName": "Peter Coates",
    "fundingAmount": 50000,
    "repaymentAmount": 55000
  }'
```

---

### 2. Get All Loans
**GET** `/api/loans`

Retrieves all loans in the system.

**Response:** `200 OK`
```json
{
  "totalCount": 2,
  "loans": [
    {
      "loanId": "a1b2c3d4-e5f6-4789-a012-3456789abcde",
      "borrowerName": "Peter Coates",
      "fundingAmount": 50000.00,
      "repaymentAmount": 55000.00,
      "createdAt": "2026-01-11T10:30:00Z"
    },
    {
      "loanId": "b2c3d4e5-f6a7-4890-b123-456789abcdef",
      "borrowerName": "Omar Din",
      "fundingAmount": 75000.00,
      "repaymentAmount": 82500.00,
      "createdAt": "2026-01-11T11:45:00Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5103/api/loans
```

---

### 3. Get Loan by ID
**GET** `/api/loans/{loanId}`

Retrieves a specific loan by its ID.

**Parameters:**
- `loanId` (path) - The unique identifier of the loan

**Response:** `200 OK`
```json
{
  "loanId": "a1b2c3d4-e5f6-4789-a012-3456789abcde",
  "borrowerName": "Peter Coates",
  "fundingAmount": 50000.00,
  "repaymentAmount": 55000.00,
  "createdAt": "2026-01-11T10:30:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Loan with ID 'invalid-id' not found"
}
```

**Example:**
```bash
curl http://localhost:5103/api/loans/a1b2c3d4-e5f6-4789-a012-3456789abcde
```

---

### 4. Get Loans by Borrower Name
**GET** `/api/loans/borrower/{borrowerName}`

Retrieves all loans for a specific borrower.

**Parameters:**
- `borrowerName` (path) - The name of the borrower

**Response:** `200 OK`
```json
[
  {
    "loanId": "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    "borrowerName": "Peter Coates",
    "fundingAmount": 50000.00,
    "repaymentAmount": 55000.00,
    "createdAt": "2026-01-11T10:30:00Z"
  }
]
```

**Error Response:** `404 Not Found`
```json
{
  "message": "No loans found for borrower 'Unknown Person'"
}
```

**Example:**
```bash
curl http://localhost:5103/api/loans/borrower/unknown%20person
```

---

### 5. Delete a Loan
**DELETE** `/api/loans/{loanId}`

Permanently removes a loan from the system.

**Parameters:**
- `loanId` (path) - The unique identifier of the loan to delete

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "message": "Loan with ID 'invalid-id' not found"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5103/api/loans/a1b2c3d4-e5f6-4789-a012-3456789abcde
```

---

## Health Check

**GET** `/health`

Returns the health status of the API.

**Response:** `200 OK`
```
Healthy
```

**Example:**
```bash
curl http://localhost:5103/health
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 OK | Request successful |
| 201 Created | Loan created successfully |
| 204 No Content | Loan deleted successfully |
| 400 Bad Request | Invalid request data |
| 404 Not Found | Loan or borrower not found |
| 500 Internal Server Error | Server error occurred |

---

## Data Models

### Loan
```typescript
{
  loanId: string;          // UUID format
  borrowerName: string;    // Required, min length 1
  fundingAmount: number;   // Required, must be > 0
  repaymentAmount: number; // Required, must be > 0
  createdAt: Date;         // ISO 8601 format
}
```

### CreateLoanRequest
```typescript
{
  borrowerName: string;    // Required
  fundingAmount: number;   // Required, must be > 0
  repaymentAmount: number; // Required, must be > 0
}
```
