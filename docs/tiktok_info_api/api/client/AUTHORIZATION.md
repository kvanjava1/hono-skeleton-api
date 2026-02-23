# Machine-to-Machine (M2M) API

This document describes the available API endpoints and authentication patterns for service-to-service communication.

## 🔐 Authentication

The system uses JWT-based authentication.

### 1. Request Access Token
Exchange your client credentials for a temporary JWT access token.

**Endpoint:** `POST /api/m2m/token`  
**Auth Required:** No (Public)

#### Request Body
```json
{
  "clientId": "your_client_id",
  "clientSecret": "your_client_secret"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Token generated successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600
  }
}
```

---

### 2. Client Identity (Me)
Verify your token and retrieve client metadata.

**Endpoint:** `GET /api/m2m/me`  
**Auth Required:** Yes (M2M Token)

#### Headers
| Header | Value |
| :--- | :--- |
| `Authorization` | `Bearer <your_token>` |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Client details fetched successfully",
  "data": {
    "id": "test_client_id",
    "name": "Service Name",
    "status": "active"
  }
}
```

---

## 🚫 Error Responses

All errors follow a unified format handled by the global error handler.

### Format
```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

### Common Status Codes
| Code | Meaning | Reason |
| :--- | :--- | :--- |
| `400` | Bad Request | Missing required fields or validation failure. |
| `401` | Unauthorized | Invalid client credentials or expired JWT. |
| `403` | Forbidden | Client account suspended or IP not whitelisted. |
| `429` | Too Many Requests | Rate limit exceeded for your client ID. |
| `500` | Internal Error | Unexpected server error. |

[⬅️ Back to API Home](../README.md)
