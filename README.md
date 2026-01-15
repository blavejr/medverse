# Medverse Backend - Session Management API

## NB PLEASE DO NOT RUN THIS IN PRODUCTION!

Firebase Cloud Functions API for managing training sessions with JWT authentication.

## Setup

```bash
# Install dependencies
cd functions && npm install

# Run locally with emulator
npm run serve

# Run tests
npm test

# Build
npm run build
```

## Deploy

```bash
# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules and indexes
npm run deploy:firestore:rules
```

## Postman

if you use postman I have included a handy postman export, which you can import into potman and easily test the endpoints
`Medverse.postman_collection.json`

## API Endpoints

Base URL: `https://europe-west1-medverse-84505.cloudfunctions.net`

### 1. Create Session
**POST** `/createSession`

Creates a new session and returns a JWT token.

**Request:**
```json
{
  "region": "eu-central"
}
```

**Response (201):**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "region": "eu-central",
    "status": "pending",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Get Session
**GET** `/getSession?id={sessionId}`

Retrieves a session. Requires JWT authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `id` (optional): Session ID to retrieve. If omitted, uses session ID from JWT token.

**Response (200):**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "region": "eu-central",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

---

### 3. Update Session Status
**PATCH** `/updateSessionStatus?id={sessionId}`

Updates a session's status. Requires JWT authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `id` (optional): Session ID to update. If omitted, uses session ID from JWT token.

**Request:**
```json
{
  "status": "active"
}
```

**Valid statuses:** `pending`, `active`, `completed`, `failed`

**Response (200):**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "region": "eu-central",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

---

### 4. List Sessions (Bonus)
**GET** `/listSessions?status={status}&region={region}&limit={limit}&page={page}`

Lists sessions with optional filtering and pagination. Requires JWT authentication.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `active`, `completed`, `failed`)
- `region` (optional): Filter by region (e.g., `eu-central`)
- `limit` (optional): Items per page (default: 5, max: 100)
- `page` (optional): Page number (default: 1)

**Response (200):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "region": "eu-central",
      "status": "active",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T12:00:00.000Z"
    }
  ],
  "page": 1,
  "count": 1,
  "pagination": {
    "limit": 5,
    "hasNext": false,
    "next": null,
    "prev": null,
    "page": 1
  }
}
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid region format"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Session abc-123 not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Example Usage

```bash
# Create a session
curl -X POST https://europe-west1-medverse-84505.cloudfunctions.net/createSession \
  -H "Content-Type: application/json" \
  -d '{"region": "eu-central"}'

# Get session (with token from create response)
curl -X GET "https://europe-west1-medverse-84505.cloudfunctions.net/getSession" \
  -H "Authorization: Bearer {token}"

# Update session status
curl -X PATCH https://europe-west1-medverse-84505.cloudfunctions.net/updateSessionStatus \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# List sessions
curl -X GET "https://europe-west1-medverse-84505.cloudfunctions.net/listSessions?status=active&limit=10" \
  -H "Authorization: Bearer {token}"
```

---

## Technology Stack

- **Firebase Cloud Functions** - HTTP endpoints (`onRequest`)
- **Firestore** - NoSQL database with composite indexes
- **TypeScript** - Strict typing throughout
- **Zod** - Runtime schema validation
- **JWT** (jsonwebtoken) - Stateless authentication
- **Jest** - Unit testing

---

## Project Structure

```
functions/
├── src/
│   ├── handlers/          # HTTP endpoint handlers
│   ├── middleware/        # JWT authentication
│   ├── utils/             # Validation, formatting, HTTP helpers
│   ├── schemas/           # Zod validation schemas
│   ├── types/             # TypeScript types and enums
│   └── config/            # Firebase Admin SDK setup
└── test/                  # Jest setup
```

---

## Design Decisions

1. **HTTP Functions (`onRequest`) over Callable Functions (`onCall`)**
   - Required for standard REST API accessible via curl/Postman
   - Better fit for JWT authentication via headers

2. **JWT Authentication**
   - Stateless, no session storage needed
   - Token contains `sessionId` for fast lookups
   - 24-hour expiration
   - Override `sessionId` via query param while maintaining auth requirement

3. **UUIDs over Firestore Auto-IDs**
   - Predictable format for API consumers
   - Generated before write (no round-trip to Firestore)

4. **Offset-based Pagination**
   - Simple page numbers (`page`, `limit`, `next`, `prev`)
   - Firestore composite indexes handle performance

5. **Error Handling**
   - Known errors (validation, not found) return specific messages
   - Unexpected errors return generic "Internal server error"
   - Full errors logged server-side for debugging

6. **Firestore Timestamps**
   - `FieldValue.serverTimestamp()` for consistency
   - Converted to ISO strings in API responses

---

## Bonus Features Implemented

✅ **Authentication** - JWT tokens with Bearer header authentication  
✅ **Unit Tests** - 32 passing tests covering utils and middleware  
✅ **List Sessions** - Filtering by status/region with pagination

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- src/utils/jwt.test.ts
```
