# [Interview Topic, e.g., Design Tik Tok]

## 1. Scope & Requirements
*Always ask clarifying questions before drawing. Do not assume.*

### Functional Requirements
*   [Feature 1, e.g., "User can upload a 15-second video."]
*   [Feature 2, e.g., "User can view a personalized video feed."]

### Non-Functional Requirements
*   **Availability:** [High/Eventual consistency, or Strict consistency?]
*   **Latency:** [e.g., "Video playback must start in < 200ms."]
*   **Scale:** [e.g., "Assume 100M Daily Active Users."]

---

## 2. Capacity Estimation (Back-of-the-Envelope Math)
*Optional, but highly recommended for senior roles to size the database and network bandwidth.*

*   **Write QPS:** [Calculation: e.g., 10M uploads/day = ~115 writes/sec]
*   **Read QPS:** [Calculation: e.g., 100M users watching 10 videos/day = ~11,500 reads/sec]
*   **Storage (per day/year):** [Calculation: e.g., 115 writes * 10MB per video = 1.15 GB/sec = ~100 TB/day]
*   **Bandwidth:** [Inbound and Outbound estimates based on storage]

---

## 3. High-Level Design

### Core API Endpoints
*   `POST /v1/videos` -> Returns video metadata and upload URL.
*   `GET /v1/feed` -> Returns list of personalized video IDs.

### Database Schema (Highly Abstract)
*   **User Table:** `user_id` (PK), `username`, `created_at`
*   **Video Table:** `video_id` (PK), `user_id` (FK), `video_url`, `created_at`

### System Architecture Map
*Draw a block diagram here linking Clients -> Load Balancer -> Web Servers -> Cache -> DB / Blob Storage.*

---

## 4. Deep Dive: Core Bottlenecks
*Focus heavily on the hardest parts of the design (e.g., how the feed generation works, or video transcoding).*

*   **Deep Dive 1: [Video Transcoding Pipeline]**
    *   [Explain how uploaded videos are compressed and sharded into multiple resolutions using object storage events and worker queues.]
*   **Deep Dive 2: [Feed Generation]**
    *   [Explain the trade-off between pre-generating feeds in Redis vs. generating them on-the-fly.]

---

## 5. Scaling & Trade-offs
*Conclude by identifying single points of failure (SPOFs) and how to handle them.*

*   **Database Sharding:** Shard SQL DB by `user_id` to distribute write load.
*   **Caching Strategy:** Cache top 20% trending videos at CDN edge locations.