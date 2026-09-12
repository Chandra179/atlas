---
title: Caching & Redis Internals
description: >-
  Caching with Redis and Memcached, Lua scripting, atomicity, and cluster hash
  slots.
aliases:
  - redis
  - memcached
  - lua-scripting
  - distributed-atomicity
  - cache-stampede
tags:
  - system-design
  - system-design/caching
  - redis
created: 2026-06-13T00:00:00.000Z
modified: '2026-09-12'
---

# Cache

## Locks vs. Atomic Operations: When to Use Which?

If 1,000 requests compete for a lock, 999 wait for the lock holder. This can cause thread starvation and database timeouts.

- **Atomic Operation**: One CPU/Redis operation that runs without interruption. No other process can read or modify the data midway through.
- **Distributed Lock**: A temporary ownership marker used across machines while a slow, multi-step, or external operation runs.

**Decision Matrix: How to Choose**

| Use Case Scenario | Use Atomic Operation | Use Distributed Lock | Why? |
|---|---|---|---|
| Increment a view counter / balance | YES (INCRBY) | No | Single numeric mutation in Redis memory ($<1\text{ms}$). |
| Claim an available driver | YES (Lua Script) | No | Reading status + setting status happens inside Redis memory in sub-milliseconds. |
| Charge a credit card via Stripe | No | YES (SETNX) | Calling Stripe's API takes $500\text{ms}$ over the internet. You cannot hold Redis atomic operations during external network I/O. |
| Multi-database write across 3 services | No | YES | You need to lock the resource while multiple microservices complete slow SQL/HTTP steps. |

**Rule of thumb**: If the state check and update happen inside Redis, use an atomic Lua script. If the process calls an external API, slow SQL, or disk, use a distributed lock with a time-to-live (TTL).

## What is a Redis Lua Script?

Redis is single-threaded. It executes commands one by one in a FIFO queue.

Normally, if your app runs two separate commands:

```
GET driver:status
SET driver:status "BUSY"
```

Another server can run a command between the two steps, causing a race condition.

A Lua script packages several steps into one request. Redis runs the script atomically, without another command running between its steps.

## Redis Internals: Why It's So Fast

Redis operations mainly use CPU and RAM.

When Redis executes a command or Lua script:

**1. In-Memory Execution (RAM + CPU)**

- **No disk I/O during execution**: Redis keeps its working data in RAM instead of reading from disk.
- **Faster memory access**: RAM access is measured in nanoseconds; disk access is measured in milliseconds.
- **CPU logic**: The CPU changes data structures such as hashes, skip lists, and sets in RAM. A simple operation usually takes less than 1 millisecond.

**2. Single-Threaded Event Loop (No CPU Context Switching)**

- Redis handles requests with a single-threaded event loop.
- It processes requests sequentially.
- The Redis engine does not need thread locks or context switches for this loop.
- An atomic operation or Lua script runs from start to finish before the next queued command.

```text
Application server
Client A ─┐
          ├─→ TCP socket → FIFO queue → CPU event loop → RAM
Client B ─┘                                      │
                                                 └─→ async save → SSD (RDB/AOF)
```

**3. Network and disk**

Redis still uses the network and disk in two places:

- **Network I/O**: Data travels over TCP/IP from the app to Redis before the operation runs. This 1–5 ms network latency is often slower than the Redis operation.
- **Disk persistence**: Redis can save RDB snapshots or AOF logs in the background, so disk writes do not block the main command loop.

**Summary Checklist for System Design**

| Operation Type             | Where It Happens                   | Speed                                  |
| -------------------------- | ---------------------------------- | -------------------------------------- |
| Redis Command / Lua Script | CPU executing logic over RAM       | Sub-millisecond ($\sim 0.1\text{ ms}$) |
| Network Request to Redis   | Network Interface Card (NIC) / TCP | $1 - 5\text{ ms}$                      |
| Traditional SQL Query      | CPU reading/writing to SSD Disk    | $10 - 100\text{ ms}$                   |

## CPU Threads vs. RAM Memory

"Single-threaded" describes how Redis uses the CPU, not how RAM works. A simple analogy:

**1. What is a CPU Thread vs. RAM Memory?**

Think of a computer as a kitchen:

- **CPU = chef**: A single-threaded system has one chef handling orders one by one.
- **RAM = countertop**: It holds data. It does not run code or have threads.

**2. How Redis Uses the CPU and RAM**

- **One CPU core**: Redis processes requests one by one in a queue.
- **Shared RAM**: That thread reads and writes data across RAM.

**3. Why Being Single-Threaded Makes Redis So Fast**

Why use one CPU core when most applications use more?

- **No locking needed**: One thread avoids concurrent writes to the same memory.
- **No context switching**: A continuous loop avoids switching between threads.
- **RAM is fast**: One core can process many requests because memory access is fast.

## Memcached vs. Redis: Multi-Threaded vs. Single-Threaded

Memcached uses a different CPU model: classic Redis runs its command loop on one thread, while Memcached is natively multi-threaded.

**1. The Multi-Threaded Architecture**

Memcached uses a worker pool, often sized to the server's CPU cores:

```text
Incoming requests → acceptor thread
                         ├─→ worker 1 ─┐
                         ├─→ worker 2 ─┼─→ shared RAM slab + hash table
                         └─→ worker 3 ─┘
```

- **Main thread**: Listens for TCP connections and distributes sockets to workers.
- **Worker threads**: Multiple cores process GET and SET commands in parallel.
- **Memory locking**: Memcached uses fine-grained mutexes to protect shared memory.

**2. Memcached vs. Redis: Head-to-Head Comparison**

| Feature | Memcached | Redis |
|---|---|---|
| CPU Thread Model | Multi-threaded (Uses all available CPU cores) | Single-threaded for core command loop (Uses 1 CPU core) |
| Data Structures | Strings/Bytes only (Flat key-value cache) | Rich Data Types (Hashes, Lists, Sets, Sorted Sets, Geospatial/H3) |
| Scripting / Logic | None (Basic GET, SET, INCR, CAS) | Atomic Lua Scripts & Modules |
| Disk Persistence | ❌ No (Volatile cache only; rebooting wipes everything) | ✅ Yes (AOF logs & RDB snapshots) |
| Memory Allocation | Fixed Slab Allocator (Prevents RAM fragmentation) | Dynamic Memory Allocation |

**3. Why choose Memcached over Redis?**

Memcached fits these cases because it is simple and multi-threaded:

- **Scaling one node**: Memcached can use all CPU cores on a large server. A single Redis instance uses one core for its command loop.
- **Simple key-value caching**: It fits rendered HTML fragments, SQL results, or JSON blobs that only need GET and SET.

**4. Why is Redis common in system design?**

Redis is often preferred when the cache also needs computation, scripting, or richer data types:

- **In-memory computation**: Redis can filter, sort, or modify data in RAM. Memcached sends the value to the app for this work.
- **Atomic logic and Lua**: Redis supports scripts for multi-step operations.
- **Data structures**: Redis supports structures useful for geospatial indexes and leaderboards.

## Lua and Redis: The Embedded Scripting Engine

Lua lets you run custom, multi-step code inside Redis with atomic, single-threaded execution.

Instead of sending several requests from the app to Redis, you send one script. Redis runs all steps in RAM without interruption.

**Why embed Lua?**

Before Lua support, reading data, making a decision, and writing it required multiple network round-trips:

That approach has two problems:

- **Network latency**: Each round-trip adds delay.
- **Race conditions**: Another server can change `user:123:balance` between the read and write.

**How Lua helps**

Lua moves the logic to the data instead of moving the data to the application:

**Three benefits of Redis + Lua**

1. **Atomicity**: Redis blocks other commands while a Lua script runs, so no client can change its keys midway. This avoids distributed locks for in-memory operations.

2. **Less network latency**: One request can replace several round-trips. Redis runs the commands locally and returns the result.

3. **Custom atomic operations**: Lua combines Redis primitives such as `INCR`, `HSET`, and `ZADD` into one business operation.

**Example: rate limiting**

This script limits a user to five requests per minute:

```lua
-- KEYS[1]: "rate:user_9921"
-- ARGV[1]: Max limit (5)
-- ARGV[2]: Window TTL in seconds (60)

local current = redis.call("GET", KEYS[1])

if current and tonumber(current) >= tonumber(ARGV[1]) then
    return 0 -- Limit exceeded! Block request.
else
    redis.call("INCR", KEYS[1])
    if not current then
        redis.call("EXPIRE", KEYS[1], ARGV[2]) -- Set 60s TTL on first request
    end
    return 1 -- Allowed!
end
```

Because this runs inside Redis via Lua:

- Checking the count, incrementing it, and setting the expiration happen as one operation.
- Two simultaneous requests cannot bypass the limit.

**How Redis executes Lua (EVAL vs. EVALSHA)**

To avoid sending the full script on every request:

- **SCRIPT LOAD**: Send the script once; Redis stores it and returns a SHA1 hash.
- **EVALSHA**: Send the hash on later requests instead of the full script.

**Summary**

- Lua is embedded in the Redis server.
- Redis + Lua provides atomic execution in RAM.
- Never use slow or infinite loops in Redis Lua scripts. Redis blocks other commands while a script runs, so keep scripts small and fast.

## Case study: preventing ride double-booking

Use a Redis Lua script so two riders cannot match with the same driver, without extra network round-trips.

**The problem: simultaneous requests**

Suppose Rider A and Rider B request a ride at the same time. Driver 123 is available and nearby for both.

**Approach 1: application-level logic**

If your app server handles the checking and setting logic using standard Redis commands:

Outcome: both riders can be assigned Driver 123.

**Approach 2: distributed locks (SETNX or Redlock)**

To fix double-booking without Lua, developers often wrap the operation in a distributed lock:

1. Acquire lock on `lock:driver:123`.
2. Send network request to fetch `GET driver:123:status`.
3. If available, send network request to `SET driver:123:status "BUSY"`.
4. Release lock on `lock:driver:123`.

Outcome: it works, but adds four network round-trips. At high request rates, connection pools and latency become bottlenecks.

**Approach 3: Redis Lua script**

Package the check and assignment into one atomic Lua script that runs in Redis:

```lua
-- KEYS[1]: "driver:status:123"
-- ARGV[1]: "MATCHING"
-- ARGV[2]: "rider_456" (Rider ID)

local current_status = redis.call("GET", KEYS[1])

if current_status == "AVAILABLE" then
    redis.call("SET", KEYS[1], ARGV[1])
    redis.call("SET", "driver:match:123", ARGV[2])
    return 1 -- SUCCESS: Rider 456 gets the driver
else
    return 0 -- FAILURE: Driver already claimed
end
```

**Why Lua fits**

- **Consistent assignment**: Redis runs one script at a time, so the second request sees the updated status.
- **Low execution time**: The check and update happen in Redis without a network hop between them.
- **Less lock overhead**: The script avoids a separate lock, heartbeat, and expiration flow.

## Distributed Atomicity: Single Node vs. Redis Cluster

Separate two concepts when discussing atomicity in a Redis cluster:

- atomicity on one Redis node, where the data lives;
- atomicity across multiple Redis nodes.

**1. Single-Node Atomicity: The Single-Threaded Event Loop**

"Atomic" means an operation runs as one indivisible unit. It succeeds or fails without another client changing the data midway.

Redis achieves this on a single node through its Single-Threaded Event Loop:

```text
Client A ─┐
Client B ─┼─→ in-memory queue → one CPU core
Client C ─┘                         ├─→ GET driver:123
                                    ├─→ Lua script
                                    └─→ INCR views
```

- **Sequential queue**: Every command or script enters an in-memory queue.
- **Lock-free execution**: Redis completes one command before starting the next.
- **No interruption**: One thread touches the data, so another client cannot modify it during a command or script.

**2. Distributed Atomicity: How Redis Cluster Handles Scale**

When you scale Redis to a Distributed Cluster (across 10, 50, or 100 machines), data is split across nodes using Hash Slots (16,384 total slots).

Each key is mapped to a slot via CRC16 hashing:

```
Slot = CRC16(Key) mod 16384
```

This leads to two distinct scenarios for atomic operations in a distributed system:

**Scenario A: Single-Key Atomicity (Always Works Built-in)**

If your atomic operation or Lua script only touches one key (e.g., INCR user:101:balance or updating `driver:99:status`), the distributed cluster forwards the request to the exact single primary node that owns that key's hash slot. That node executes the command using its local single-threaded event loop. Single-key operations are always 100% atomic across the cluster.

**Scenario B: Multi-Key Atomicity and The Cross-Slot Error**

What happens if a Lua script needs to atomically update two keys (e.g., transfer money from `user:101` to `user:202`)?

If `user:101` lives on Node 1 and user:202 lives on Node 2, Redis cannot execute the Lua script atomically. A single-threaded Redis engine cannot reach across the network to lock memory on another server during a single execution step. If you attempt this, Redis throws a CROSSSLOT error.

**How to Achieve Multi-Key Atomicity in Distributed Redis**

For atomic operations across multiple keys, use two techniques:

**1. Hash Tags (Force Keys onto the Same Node)**

Wrapping part of a key in `{...}` tells Redis Cluster to hash only the text inside the braces.

- Key A: `user:{group_123}:balance`
- Key B: `user:{group_123}:discount_coupon`

Because both keys share `{group_123}`, Redis guarantees they map to the same Hash Slot and the same physical node. Now, a multi-key Lua script can run atomically over both keys without network hops.

**2. Distributed Locks (Redlock Algorithm for Multi-Node Systems)**

When keys must live on different servers or datacenters, use a distributed consensus lock such as Redlock.

```text
Application worker → Redis node 1 ─┐
                     Redis node 2 ─┼─→ majority (3 of 5) → mutation → release
                     Redis node 3 ─┘
```

The client tries to acquire `SET lock_key uuid NX PX 1000` on N independent Redis primaries. If it gets a majority within the timeout, the application performs its work and releases the locks.

**Summary Checklist for System Design**

| Scale Scope                        | How Atomicity is Maintained                     | Cost / Latency                        |
| ---------------------------------- | ----------------------------------------------- | ------------------------------------- |
| Single Key on 1 Node               | Native Single-Threaded Event Loop (RAM)         | Sub-millisecond (~0.1 ms)             |
| Multi-Key on 1 Node (or Hash Tags) | Atomic Lua Script on the target node            | Sub-millisecond (~0.5 ms)             |
| Multi-Node / Multi-Cluster         | Distributed Locking (Redlock) or 2-Phase Commit | Higher latency (5-20 ms network hops) |
