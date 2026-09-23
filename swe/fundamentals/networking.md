---
title: "Networking"
description: "What happens between keystroke and response: DNS, TCP/IP, HTTP, and the network stack for software engineers."
aliases: []
tags: [cs, cs/networking]
created: "2026-06-13"
---
	
# Networking

## DNS

//  TODO: dns flow   using ascii  diagram

1. Browser checks its own cache. Did we resolve this domain recently?
2. OS cache. The operating system remembers recent lookups.
3. Router / ISP resolver. Your home router forwards the question upstream.
4. Recursive resolver walks the DNS hierarchy: root servers → `.com` TLD servers → `example.com` authoritative nameserver → `api.example.com` record.


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

## TLS

TCP gives reliability but not privacy. Anyone on the network between you and the server can read the bytes. TLS (Transport Layer Security) wraps the TCP connection in encryption.

1. Client sends supported cipher suites + a random number.
2. Server responds with chosen cipher + its certificate (containing its public key).
3. Client verifies the certificate chain against trusted root CAs.
4. Both sides derive a shared session key using Diffie-Hellman key exchange.
5. All subsequent data is encrypted with this session key.

After the TLS handshake, you have an **encrypted, authenticated** channel. A network observer sees only that you connected to `142.250.185.14:443` and the approximate volume of data nothing about the content.

## HTTP

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

## NAT



### Why NAT Exists

NAT (Network Address Translation) solved a crisis: **IPv4 exhaustion**. The IPv4 address space has ~4.3 billion addresses. There are more devices than that. NAT lets thousands of devices share one public IP. It's the reason your home Wi-Fi works without your ISP assigning every phone, laptop, and smart TV its own public address.

### NAT Types

- **Static NAT** (1-to-1): one private IP maps to one public IP. Used for servers inside a network that need to be reachable from outside.
- **Dynamic NAT** (M-to-M): private IPs map to a pool of public IPs on demand.
- **PAT / NAT Overload**: the most common form. Thousands of private IPs share **one** public IP by using unique source ports to distinguish sessions.

### Packet Flow

When your laptop (`192.168.1.50:5000`) sends a request to `142.250.185.14:443`:

// TODO: use ascii diagram  to illustrate the packet  flow

The NAT table is the critical piece. Without an active mapping, an incoming packet has nowhere to go the router drops it. This is why NAT acts as a de facto firewall, but also why peer-to-peer connections are hard.

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