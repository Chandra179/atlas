---
title: "Networking"
description: "What happens between keystroke and response: DNS, TCP/IP, HTTP, and the network stack for software engineers."
aliases: []
tags: [cs, cs/networking]
created: "2026-06-13"
---
	
# Networking

For software engineers who want to understand what happens between keystroke and response. Assumes basic programming knowledge but no prior networking experience.

Every web request is a journey through multiple layers of the network stack. Let's follow one: you type `https://api.example.com/users` and press Enter. What actually happens between that keystroke and the JSON response appearing on your screen?

## DNS: Finding the Address

Before any data can flow, your browser needs to know **where** to send it. `api.example.com` is a human-readable name the network speaks IP addresses. DNS (Domain Name System) translates one to the other.

1. Browser checks its own cache. Did we resolve this domain recently?
2. OS cache. The operating system remembers recent lookups.
3. Router / ISP resolver. Your home router forwards the question upstream.
4. Recursive resolver walks the DNS hierarchy: root servers → `.com` TLD servers → `example.com` authoritative nameserver → `api.example.com` record.

The answer: `api.example.com` → `142.250.185.14`. Now the browser knows where to connect.

## TCP

The browser opens a TCP connection to `142.250.185.14:443` (port 443 = HTTPS). TCP provides a reliable, ordered byte stream over the unreliable IP layer.

### The Three-Way Handshake

```
Client Server
 | -------- SYN (seq=x) ----------> | "Can we talk?"
 | <-- SYN-ACK (seq=y, ack=x+1) --  | "Yes."
 | -------- ACK (ack=y+1) --------> | "Great."
 | 
 | ===== Connection Established ====|
```

This exchange establishes sequence numbers on both sides so each byte can be tracked, acknowledged, and retransmitted if lost. Every connection pays this round-trip cost before any application data flows.

### Connection Pooling

Opening a new TCP connection for every HTTP request is wasteful each one pays the handshake penalty. Connection pooling reuses established connections for multiple requests. The browser (or your backend HTTP client) keeps a pool of open connections and assigns requests to idle ones.

### Keep-Alive

Without Keep-Alive, the server closes the connection after each response. With `Connection: keep-alive`, the connection stays open for subsequent requests. HTTP/1.1 made this the default. HTTP/2 and HTTP/3 assume multiplexed persistent connections.

## TLS: The Encrypted Tunnel

TCP gives reliability but not privacy. Anyone on the network between you and the server can read the bytes. TLS (Transport Layer Security) wraps the TCP connection in encryption.

1. Client sends supported cipher suites + a random number.
2. Server responds with chosen cipher + its certificate (containing its public key).
3. Client verifies the certificate chain against trusted root CAs.
4. Both sides derive a shared session key using Diffie-Hellman key exchange.
5. All subsequent data is encrypted with this session key.

After the TLS handshake, you have an **encrypted, authenticated** channel. A network observer sees only that you connected to `142.250.185.14:443` and the approximate volume of data nothing about the content.

## HTTP: The Application Protocol

Now the encrypted pipe is open. The browser sends:

```
GET /users HTTP/1.1
Host: api.example.com
Accept: application/json
```

The server responds:

```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
```

### HTTP Version Evolution

| Version | Transport | Key Feature | Primary Trade-off |
|---|---|---|---|
| HTTP/1.1 | TCP | Persistent connections | Head-of-Line blocking at application layer. A slow response blocks all later requests on the same connection. |
| HTTP/2 | TCP | Multiplexing & binary framing | Multiple requests interleaved on one connection, but TCP-level HOL blocking: one lost packet stalls everything. |
| HTTP/3 | UDP (QUIC) | No HOL blocking & connection migration | Higher CPU usage; some firewalls block UDP. QUIC integrates TLS 1.3 natively. |

The progression is about eliminating blocking at each layer. HTTP/1.1 eliminated per-request connections. HTTP/2 eliminated application-level queuing. HTTP/3 eliminated transport-level head-of-line by moving off TCP entirely to QUIC (UDP-based), where each stream is independent a lost packet on stream A has zero effect on stream B.

### Caching

Caching reduces latency and server load:

- `Cache-Control: max-age=3600` browser can use its cached copy for 1 hour without contacting the server.
- `Cache-Control: no-cache` browser must re-validate with the server before using the cached copy.
- `Cache-Control: immutable` the resource will never change. Ideal for versioned assets (`app.abc123.js`).
- **ETag** a unique hash of the resource content. Browser sends `If-None-Match: "abc123"` on subsequent requests. If the hash hasn't changed, server returns `304 Not Modified` with no body. Saves bandwidth, not latency.

### Authentication

Web authentication follows a spectrum from simple to complex:

**Cookies** Client-side storage (~4 KB). The server sets `Set-Cookie: session_id=xyz` and the browser automatically attaches it to every subsequent request. Simple but vulnerable to XSS if not HttpOnly.

**Sessions** Server-side storage. The cookie holds only a `SessionID`. The actual data (cart, user info, permissions) stays on the server. More secure because sensitive data never leaves the server.

**JWT (JSON Web Token)** Stateless. The token itself contains all user data (claims) and is cryptographically signed by the server. No server-side lookup needed the server just verifies the signature. Tradeoff: tokens can't be revoked server-side until they expire.

**Basic Auth** Username + password, Base64-encoded, sent in the `Authorization` header. Simple but must always run over HTTPS (Base64 is encoding, not encryption).

**OAuth2** Delegated authorization framework. "Login with Google" uses OAuth2: your app never sees the user's Google password. The user authenticates with Google, Google gives your app a token granting specific permissions.

### Idempotency

Some HTTP methods are safe to retry, others aren't:

- **Idempotent**: GET, PUT, DELETE. Multiple identical requests have the same effect as one. Retrying a `DELETE /users/5` is harmless the user is already deleted.
- **Non-idempotent**: POST. Multiple identical POSTs create multiple resources. Retrying a `POST /orders` with a payment creates duplicate charges.

This is why browsers warn "are you sure you want to resubmit?" on POST forms, but not on GET links.

## CORS

By default, a script on `app.example.com` cannot read the response from `api.other-domain.com` even if the request succeeds. This is the Same-Origin Policy: scripts can only read responses from their own origin (same protocol + domain + port).

CORS (Cross-Origin Resource Sharing) is how servers opt in to cross-origin access. When `api.other-domain.com` responds with `Access-Control-Allow-Origin: https://app.example.com`, the browser allows the script to read the response. Without this header, the browser blocks the read even though the server sent the data.

Preflight requests (`OPTIONS`) add an extra round trip: before a cross-origin request with non-simple headers or methods, the browser asks "would you allow this?" and only proceeds if the server says yes.

## The Return Path

The request reached the server, but infrastructure shapes the response's journey back:

**CDNs (Content Delivery Networks)** Static assets (images, JS bundles, CSS) are cached at edge locations worldwide. A user in Tokyo doesn't fetch an image from Virginia the CDN edge node in Tokyo serves it in milliseconds.

**Load Balancers** Distribute incoming requests across multiple server instances. Layer 4 (TCP) balancers are fast but blind to HTTP. Layer 7 (HTTP) balancers can route based on URL path, headers, or cookies `/api/` goes to the backend cluster, `/static/` goes to the CDN.

## NAT: How Your Private IP Reaches the Internet

So far we've followed the request from your laptop to the server and back. But the journey starts in your living room and your laptop has a `192.168.1.50` address, a **private** IP the public internet can't route. How does it communicate at all?

### Why NAT Exists

NAT (Network Address Translation) solved a crisis: **IPv4 exhaustion**. The IPv4 address space has ~4.3 billion addresses. There are more devices than that. NAT lets thousands of devices share one public IP. It's the reason your home Wi-Fi works without your ISP assigning every phone, laptop, and smart TV its own public address.

### NAT Types

- **Static NAT** (1-to-1): one private IP maps to one public IP. Used for servers inside a network that need to be reachable from outside.
- **Dynamic NAT** (M-to-M): private IPs map to a pool of public IPs on demand.
- **PAT / NAT Overload**: the most common form. Thousands of private IPs share **one** public IP by using unique source ports to distinguish sessions.

### Packet Flow

When your laptop (`192.168.1.50:5000`) sends a request to `142.250.185.14:443`:

1. Router receives the packet, creates a NAT table entry: `192.168.1.50:5000 ↔ 145.23.66.90:41200`.
2. Router rewrites the source to `145.23.66.90:41200` and forwards to the internet.
3. Server responds to `145.23.66.90:41200`.
4. Router looks up `41200` in the NAT table, finds `192.168.1.50:5000`, rewrites the destination, forwards.

The NAT table is the critical piece. Without an active mapping, an incoming packet has nowhere to go the router drops it. This is why NAT acts as a de facto firewall, but also why peer-to-peer connections are hard.

<details>
<summary><strong>P2P Mechanics and NAT Traversal</strong></summary>

How "friendly" a NAT is to peer-to-peer connections depends on its behavior:

**Mapping Behavior** (how public ports are assigned for outgoing connections):

| Type | Behavior | P2P Difficulty |
|------|----------|----------------|
| Endpoint-Independent (EIM) | Same public port for all destinations | Easy |
| Address-Dependent (ADM) | Different port for different destination IPs | Medium |
| Address-and-Port-Dependent (Symmetric) | Different port for every unique IP:Port | Hard |

**Filtering Behavior** (who can send data back through an opened port):

| Type | Who Can Send Back | P2P Difficulty |
|------|-------------------|----------------|
| Endpoint-Independent Filtering (EIF) | Anyone | Easy |
| Address-Restricted | Only the IP you contacted | Medium |
| Port-Restricted | Only the specific IP:Port you contacted | Hard |

Symmetric NAT + Port-Restricted filtering is the worst case for P2P. This is what most mobile carriers and many home ISPs use.

When two devices behind NATs want to connect directly:

**STUN** (Session Traversal Utilities for NAT) A "what's my IP?" service. Both devices ask a STUN server: "What public IP:Port do you see me as?" They exchange these addresses and try to connect directly. Works for EIM/EIF. Fails on Symmetric NAT because the port used for the STUN query differs from the port that would be used for the peer connection.

**TURN** (Traversal Using Relays around NAT) If STUN fails, traffic is relayed through a TURN server. Both devices connect to the relay, and it forwards data between them. 100% success rate, but the relay sees all traffic (encrypted if you use TLS), and bandwidth/latency costs are higher.

**ICE** (Interactive Connectivity Establishment) The manager. ICE collects candidates (local IPs, STUN-derived public IPs, TURN relay addresses), tests connectivity between all pairs, and picks the best working path. Tries direct first, falls back to relay only if necessary.

</details>

### Advanced NAT

**Hairpinning (NAT Loopback)** Accessing an internal device using the public IP from inside the same network. Without hairpinning, `https://myhome.server.com` works from a coffee shop but not from your living room. The router must recognize that the destination public IP is itself and loop the traffic back internally.

**CGNAT (Carrier-Grade NAT)** Used by mobile ISPs and many home ISPs. Your router's "public IP" is actually another private IP (usually in the `100.64.x.x` range). This is double NAT your home router translates private → carrier-private, and the carrier translates carrier-private → public. The extra layer makes port forwarding nearly impossible without a VPN or tunnel (Tailscale, Cloudflare Tunnel).

**UPnP / NAT-PMP** Protocols that let applications (gaming consoles, torrent clients) automatically request the router to open and forward a port. Convenient but a security concern any malware on your network can open ports too.

## References

- [IETF RFC 2616 HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [IETF RFC 7540 HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [IETF RFC 9000 QUIC & HTTP/3](https://datatracker.ietf.org/doc/html/rfc9000)
- [IETF RFC 8446 TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [IETF RFC 7519 JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [IETF RFC 6749 OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749)
- [IETF RFC 7234 HTTP Caching (Cache-Control)](https://datatracker.ietf.org/doc/html/rfc7234)
- [IETF RFC 7232 HTTP ETag / Conditional Requests](https://datatracker.ietf.org/doc/html/rfc7232)
- [IETF RFC 6454 Same-Origin Policy / CORS](https://datatracker.ietf.org/doc/html/rfc6454)
- [IETF RFC 2663 NAT Terminology](https://datatracker.ietf.org/doc/html/rfc2663)
- [IETF RFC 4787 NAT Behavioral Requirements (Mapping)](https://datatracker.ietf.org/doc/html/rfc4787)
- [IETF RFC 5382 NAT Behavioral Requirements (TCP)](https://datatracker.ietf.org/doc/html/rfc5382)
- [IETF RFC 6598 Carrier-Grade NAT (100.64.x.x)](https://datatracker.ietf.org/doc/html/rfc6598)
- [IETF RFC 3489 / 5389 STUN](https://datatracker.ietf.org/doc/html/rfc5389)
- [IETF RFC 5766 TURN](https://datatracker.ietf.org/doc/html/rfc5766)
- [IETF RFC 8445 ICE](https://datatracker.ietf.org/doc/html/rfc8445)
- [RFC 5128 P2P NAT Traversal](https://datatracker.ietf.org/doc/html/rfc5128)
- [Cloudflare What is CGNAT?](https://www.cloudflare.com/learning/network-layer/what-is-cgnat/)
