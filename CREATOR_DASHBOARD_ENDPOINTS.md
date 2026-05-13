# Creator Dashboard — API Endpoints

All endpoints require authentication: `Authorization: Bearer {token}`

---

## DASHBOARD PAGE

### 1. Dashboard Stats (Stats Cards)

`GET /api/v1/creator/dashboard`

**Status:** Implemented

**What it returns:** The 4 stat cards at the top — total views, subscribers, likes, earnings with month-over-month percentage change.

**Response:**

```json
{
    "status": true,
    "message": "creator dashboard stats",
    "data": {
        "total_views": 156847,
        "total_views_change": 12.5,
        "subscribers": 8429,
        "subscribers_change": 5.2,
        "total_likes": 24891,
        "total_likes_change": 8.1,
        "total_earnings": 2847,
        "total_earnings_change": null
    }
}
```

**Notes:**

- `*_change` = percentage change from last month to this month
- `total_earnings` = wallet coin_balance
- `total_earnings_change` = not available yet (need earning history to calculate)

---

### 2. Recent Comic Performance

`GET /api/v1/creator/recent-performance?limit=5`

**Status:** Implemented

**What it returns:** Latest episodes uploaded by the creator with their stats (for the "Recent Comic Performance" section).

**Parameters:**


| Param   | Type | Default | Description                  |
| ------- | ---- | ------- | ---------------------------- |
| `limit` | int  | 5       | Number of episodes to return |


**Response:**

```json
{
    "status": true,
    "message": "recent comic performance",
    "data": [
        {
            "comic_title": "Shadow Realm Chronicles",
            "episode_title": "Episode 15",
            "episode_number": 15,
            "status": "Published",
            "views": 12500,
            "likes": 890,
            "created_at": "2 days ago"
        },
        {
            "comic_title": "Cyber Night",
            "episode_title": "Episode 8",
            "episode_number": 8,
            "status": "Published",
            "views": 8200,
            "likes": 654,
            "created_at": "5 days ago"
        }
    ]
}
```

---

### 3. Top Comics

`GET /api/v1/creator/top-comics?sort_by=view_count&limit=10&page=1`

**Status:** Implemented

**What it returns:** Creator's comics ranked by views or date. Paginated.

**Parameters:**


| Param     | Type   | Default      | Description                           |
| --------- | ------ | ------------ | ------------------------------------- |
| `sort_by` | string | `view_count` | Sort by: `view_count` or `created_at` |
| `limit`   | int    | 10           | Results per page                      |
| `page`    | int    | 1            | Page number                           |


**Response:**

```json
{
    "status": true,
    "message": "top comics",
    "data": {
        "comics": [
            {
                "id": 1,
                "uuid": "...",
                "title": "Shadow Realm Chronicles",
                "view_count": 12500,
                "comic_likes_count": 890,
                "comic_views_count": 450,
                "status_id": 1,
                "created_at": "2025-01-15T10:00:00.000000Z",
                "user": { ... },
                "genres": [ ... ]
            }
        ],
        "pagination": {
            "total": 5,
            "count": 5,
            "perPage": 10,
            "currentPage": 1,
            "totalPages": 1
        }
    }
}
```

---

### 4. Subscribers List

`GET /api/v1/creator/subscribers?limit=10&page=1`

**Status:** Implemented

**What it returns:** Users who subscribed to the creator's comics. Paginated.

**Parameters:**


| Param   | Type | Default | Description      |
| ------- | ---- | ------- | ---------------- |
| `limit` | int  | 10      | Results per page |
| `page`  | int  | 1       | Page number      |


**Response:**

```json
{
    "status": true,
    "message": "subscriber records",
    "data": {
        "subscribers": [
            {
                "id": 1,
                "user_id": 42,
                "author_id": 3,
                "created_at": "2026-03-15T10:00:00.000000Z",
                "user": {
                    "id": 42,
                    "first_name": "John",
                    "last_name": "Doe",
                    "username": "johndoe",
                    "photo": "https://..."
                }
            }
        ],
        "pagination": {
            "total": 100,
            "count": 10,
            "perPage": 10,
            "currentPage": 1,
            "totalPages": 10
        }
    }
}
```

---

### 5. Followers List

`GET /api/v1/creator/followers?limit=10&page=1`

**Status:** Implemented

**What it returns:** Users who follow the creator. Paginated.

**Parameters:**


| Param   | Type | Default | Description      |
| ------- | ---- | ------- | ---------------- |
| `limit` | int  | 10      | Results per page |
| `page`  | int  | 1       | Page number      |


**Response:**

```json
{
    "status": true,
    "message": "follower records",
    "data": {
        "followers": [
            {
                "id": 1,
                "user_id": 42,
                "creator_id": 3,
                "created_at": "2026-03-20T10:00:00.000000Z",
                "user": {
                    "id": 42,
                    "first_name": "Jane",
                    "last_name": "Smith",
                    "username": "janesmith",
                    "photo": "https://..."
                }
            }
        ],
        "pagination": {
            "total": 50,
            "count": 10,
            "perPage": 10,
            "currentPage": 1,
            "totalPages": 5
        }
    }
}
```

---

## ANALYTICS PAGE

### 6. Comic Analytics Overview

`GET /api/v1/creator/analytics/{comic_id}?period=28d`

**Status:** Implemented

**What it returns:** Overview stats for a specific comic filtered by time period (for the Overview tab).

**Parameters:**


| Param      | Type   | Default  | Description                                        |
| ---------- | ------ | -------- | -------------------------------------------------- |
| `comic_id` | int    | required | Comic ID (in URL path)                             |
| `period`   | string | `28d`    | Time period: `7d`, `28d`, `90d`, `6m`, `1y`, `all` |


**Response:**

```json
{
    "status": true,
    "message": "comic analytics",
    "data": {
        "comic_title": "Shadow Realm Chronicles",
        "period": "28d",
        "total_views": 5200,
        "total_likes": 340,
        "total_subscribers": 120,
        "total_comments": 85,
        "episodes_count": 15
    }
}
```

---

### 7. Episode Breakdown

`GET /api/v1/creator/analytics/{comic_id}/episodes?limit=10&page=1`

**Status:** Implemented

**What it returns:** Per-episode performance breakdown for a comic. Paginated.

**Parameters:**


| Param      | Type | Default  | Description            |
| ---------- | ---- | -------- | ---------------------- |
| `comic_id` | int  | required | Comic ID (in URL path) |
| `limit`    | int  | 10       | Results per page       |
| `page`     | int  | 1        | Page number            |


**Response:**

```json
{
    "status": true,
    "message": "episode breakdown",
    "data": {
        "episodes": [
            {
                "id": 15,
                "comic_id": 1,
                "title": "The Final Battle",
                "episode_number": 15,
                "created_at": "2026-04-20T10:00:00.000000Z"
            }
        ],
        "pagination": {
            "total": 15,
            "count": 10,
            "perPage": 10,
            "currentPage": 1,
            "totalPages": 2
        }
    }
}
```

---

## EXISTING ENDPOINTS (Already Built)

### Comic Management


| #   | Method   | Endpoint                                     | Description             |
| --- | -------- | -------------------------------------------- | ----------------------- |
| 1   | `GET`    | `/api/v1/my-libraries/comics`                | List creator's comics   |
| 2   | `GET`    | `/api/v1/my-libraries/comics/{comic}/get`    | Get comic details       |
| 3   | `POST`   | `/api/v1/my-libraries/comics/create`         | Create a comic          |
| 4   | `PATCH`  | `/api/v1/my-libraries/comics/{comic}/update` | Update a comic          |
| 5   | `DELETE` | `/api/v1/my-libraries/comics/{comic}/delete` | Delete a comic          |
| 6   | `PUT`    | `/api/v1/my-libraries/comics/{comic}/toggle` | Publish/unpublish comic |


### Episode Management


| #   | Method   | Endpoint                                                       | Description               |
| --- | -------- | -------------------------------------------------------------- | ------------------------- |
| 7   | `GET`    | `/api/v1/my-libraries/chapters/{comic}/pull/all`               | List episodes             |
| 8   | `GET`    | `/api/v1/my-libraries/chapters/{episode}/comic/{comic}/get`    | Get episode details       |
| 9   | `POST`   | `/api/v1/my-libraries/chapters/comic/{comic}/create`           | Create episode            |
| 10  | `PATCH`  | `/api/v1/my-libraries/chapters/{episode}/comic/{comic}/update` | Update episode            |
| 11  | `DELETE` | `/api/v1/my-libraries/chapters/{episode}/comic/{comic}/delete` | Delete episode            |
| 12  | `PUT`    | `/api/v1/my-libraries/comic-panel/{image}/toggle`              | Toggle panel monetization |


### Shorts Management


| #   | Method   | Endpoint                                     | Description             |
| --- | -------- | -------------------------------------------- | ----------------------- |
| 13  | `GET`    | `/api/v1/my-libraries/shorts`                | List creator's shorts   |
| 14  | `GET`    | `/api/v1/my-libraries/shorts/{short}/get`    | Get short details       |
| 15  | `POST`   | `/api/v1/my-libraries/shorts/create`         | Create a short          |
| 16  | `PATCH`  | `/api/v1/my-libraries/shorts/{short}/update` | Update a short          |
| 17  | `DELETE` | `/api/v1/my-libraries/shorts/{short}/delete` | Delete a short          |
| 18  | `PUT`    | `/api/v1/my-libraries/shorts/{short}/toggle` | Publish/unpublish short |


### Creator Profile (Public)


| #   | Method | Endpoint                                           | Description                 |
| --- | ------ | -------------------------------------------------- | --------------------------- |
| 19  | `GET`  | `/api/v1/comics/{creator_id}/pull`                 | Get creator's public comics |
| 20  | `GET`  | `/api/v1/profile/{creator_id}/follow`              | Follow a creator            |
| 21  | `GET`  | `/api/v1/profile/{creator_id}/unfollow`            | Unfollow a creator          |
| 22  | `GET`  | `/api/v1/profile/{creator_id}/check-follow-status` | Check if following          |


---

## PENDING — Waiting for PM Clarification

### Earnings Breakdown

`GET /api/v1/creator/earnings-breakdown`

**Status:** Blocked — Need to know how Ads Revenue, Credits Revenue, and Bonus are tracked.

**Questions:**

- Is there a table for earnings transactions?
- How are ads revenue calculated?
- What determines the "bonus" amount?
- Are earnings per comic or per creator?

---

### Comic Earnings Analytics

`GET /api/v1/creator/analytics/{comic_id}/earnings?period=28d`

**Status:** Partially blocked — Need clarity on what "Total Earnings" per comic means.

**Questions:**

- Are earnings from unlocked panels (credits spent by readers)?
- Is there an ads revenue component per comic?

---

### Monthly Earnings Chart

`GET /api/v1/creator/analytics/{comic_id}/chart?type=credits&period=6m`

**Status:** Partially blocked — Need earnings transaction history to build monthly charts.

**Questions:**

- Same as earnings breakdown above

---

### Withdraw Earnings

`POST /api/v1/creator/withdraw`

**Status:** Blocked — Need to know the withdrawal process.

**Questions:**

- Where do earnings go? Bank account? Mobile money?
- Is there a minimum withdrawal amount?
- What is the approval process?
- Are there fees?

---

### Settlement History

`GET /api/v1/creator/settlement-history`

**Status:** Blocked — Need to know what a settlement looks like.

**Questions:**

- Is a settlement the same as a withdrawal?
- What statuses can a settlement have? (pending, processed, failed?)
- What details are stored? (amount, date, bank, reference?)

---

## SUMMARY


| Category                                  | Count  | Status  |
| ----------------------------------------- | ------ | ------- |
| Existing (Comics/Episodes/Shorts/Profile) | 22     | Done    |
| New Dashboard Endpoints                   | 7      | Done    |
| Pending (PM Clarification)                | 5      | Blocked |
| **Total**                                 | **34** |         |


