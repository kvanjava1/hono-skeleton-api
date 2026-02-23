# Rate Limiting

To ensure system stability and fair usage, this API implements two distinct layers of rate limiting.

---

## 🛡️ Layer 1: HTTP Connection Protection (IP-based)
This layer protects the server from brute-force attacks and abnormal traffic spikes. It applies to your public IP address.

- **Limit Type**: Dynamic (based on server configuration).
- **Scope**: Per Individual IP.
- **Reset Window**: Configurable (e.g., 15 minutes).
- **Storage**: In-memory.

### 🕒 Practical Example
If the server is configured with `MAX=100` and `WINDOW_MS=900000`:
- This means **100 requests every 15 minutes** per IP (~6 requests/minute).
- If you send 101 requests at 12:05 PM, you will be blocked until 12:15 PM.
- The `Retry-After` header will tell you exactly how many seconds to wait.

### Headers Returned
When this limit is triggered, you will receive a `429 Too Many Requests` status with the following headers:
- `X-RateLimit-Limit`: Maximum requests allowed in the window.
- `X-RateLimit-Remaining`: Number of requests left (will be `0`).
- `X-RateLimit-Reset`: Unix timestamp when the limit resets.
- `Retry-After`: Seconds to wait before your next request.

---

## 💼 Layer 2: Client Usage Quotas (Account-based)
This layer enforces the business-level quotas assigned to your M2M Client ID. 

- **Limit Type**: Fixed (configured per client in the database).
- **Scope**: Per Client ID.
- **Reset Window**: 1 Hour (rolling).
- **Storage**: Persistent (Database).

### Behavior
If you exceed your hourly quota, the API will return a `429 Too Many Requests` response with a JSON error body:

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again later.",
  "data": null
}
```

---

## 💡 Best Practices for Clients
1. **Batching**: Use the `callback` processing mode for large TikTok profile lists instead of sending multiple `instant` requests.
2. **Backoff**: If you receive a `429` error, respect the `Retry-After` header or wait at least 1 minute before retrying.
3. **Queue Awareness**: Remember that successful `callback` requests count towards your Layer 2 quota just like `instant` requests, but they process hundreds of profiles in a single HTTP call.
