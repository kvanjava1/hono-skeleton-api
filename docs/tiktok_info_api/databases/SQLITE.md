# SQLite Database Schema

The SQLite database is used for local storage, infrastructure configuration, and M2M client management.

## 📊 Tables

### 1. `api_clients`
Stores credentials and configuration for Machine-to-Machine (M2M) clients.

| Column | Type | Description |
| :--- | :--- | :--- |
| **`id`** | `INTEGER` | Primary Key (Auto-increment). |
| **`name`** | `TEXT` | Descriptive name of the service/website. |
| **`client_id`** | `TEXT` | Unique identifier (indexed). |
| **`client_secret`** | `TEXT` | Bcrypt hashed secret. |
| **`rate_limit`** | `INTEGER` | Max requests per hour (Default: 1000). |
| **`allowed_ips`** | `TEXT` | Comma-separated list of authorized IPs. |
| **`status`** | `TEXT` | Activation state (`active`, `suspended`). |
| **`created_at`** | `TEXT` | ISO timestamp of registration. |
| **`updated_at`** | `TEXT` | ISO timestamp of last modification. |

### 2. `api_usage_logs`
Tracks request history for auditing and rate limiting.

| Column | Type | Description |
| :--- | :--- | :--- |
| **`id`** | `INTEGER` | Primary Key. |
| **`client_id`** | `TEXT` | Foreign Key to `api_clients.client_id`. |
| **`ip_address`** | `TEXT` | The IP address of the caller. |
| **`endpoint`** | `TEXT` | The API path requested. |
| **`method`** | `TEXT` | HTTP Verb (GET, POST, etc.). |
| **`status_code`** | `INTEGER` | HTTP Response code sent. |
| **`request_body`** | `TEXT` | (Optional) Captured JSON input payload. |
| **`response_body`** | `TEXT` | (Optional) Captured JSON output payload. |
| **`timestamp`** | `TEXT` | ISO timestamp of the event. |

### 3. `request_tiktok_profiles`
Tracks asynchronous TikTok profile scraping requests and their progress.

| Column | Type | Description |
| :--- | :--- | :--- |
| **`request_id`** | `TEXT` | Primary Key (UUID). |
| **`client_id`** | `TEXT` | M2M Client ID who initiated the request. |
| **`usernames`** | `TEXT` | JSON Array of usernames to process. |
| **`total_username`** | `INTEGER` | Total number of usernames in the request. |
| **`total_process`** | `INTEGER` | Current number of profiles processed. |
| **`total_error`** | `INTEGER` | Count of failed profile scrapes. |
| **`total_success`** | `INTEGER` | Count of successful profile scrapes. |
| **`result`** | `TEXT` | JSON Array of scraping results. |
| **`process_status`** | `TEXT` | Status (`pending`, `processing`, `done`). |
| **`callback_url`** | `TEXT` | Webhook URL for notification on completion. |
| **`callback_response`** | `TEXT` | JSON result of the last callback attempt. |
| **`callback_retry_count`** | `INTEGER` | Number of times the callback has retried (Max: 3). |
| **`created_at`** | `TEXT` | Timestamp of request creation. |
| **`updated_at`** | `TEXT` | Timestamp of last progress update. |

[⬅️ Back to Database Home](./README.md)
