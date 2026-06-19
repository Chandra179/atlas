---
title: "Oauth2 & Oidc"
aliases: []
tags: [cs, cs/oauth]
created: "2026-06-13"
---
	
# Oauth2 & Oidc

For backend engineers implementing OAuth 2.0 and OpenID Connect in server-side web applications. Covers the authorization code flow with PKCE. Assumes familiarity with OAuth roles (client, authorization server, resource server).

## Authorization URL

Use PKCE (Proof Key for Code Exchange) to prevent authorization code injection, and `state` to prevent CSRF. Both are mandatory for security.

## Callback Handler

Swaps the code for tokens and validates the ID Token signature/claims.

## Session Management

Use `HttpOnly` cookies to protect against XSS and enforce HTTPS only. Session should depend on an interface so the concrete implementation is swappable (e.g., in-memory, Redis). Session TTL: should match the Refresh Token TTL (or a fixed policy like "24 hours of inactivity").

## Token Management

### Access Token TTL

Short (e.g., 5–15 minutes).

### Refresh Token Failure

Check if refresh attempt fails (e.g., the refresh token is expired). Handle failure gracefully: delete the session, force re-login (same as logout mechanism).

### Proactive Refresh

Don't wait for the token to actually expire and fail a request. Instead, check the token's age on every request and refresh it _before_ it dies. Refresh Token TTL: Long (e.g., 7–30 days).

### Concurrency Race

If a user loads a dashboard that fires 5 API requests simultaneously (e.g., fetching profile, graph data, notifications), and their token is expired:

1. Request A sees expired token → starts refreshing.
2. Request B sees expired token → starts refreshing.
3. Request A gets a new Refresh Token (RT-2).
4. Request B tries to use the old Refresh Token (RT-1).
5. The OIDC provider sees RT-1 being used twice. It assumes theft and revokes everything. The user is logged out.

How to fix this?

* **Simple fix:** Use a large leeway (e.g., 5 minutes). It is statistically unlikely that a user makes requests _exactly_ at the moment of expiry if you refresh 5 minutes early.
* **Robust fix (locking):** If you use Redis, set a temporary `refresh_in_progress` lock. If Request B sees the lock, it waits 100ms and reads the session again (which will have the new token from Request A).

## Middleware

For protected routes, require the user to be logged in first.

## Logout

Delete the local session (destroy the session in Redis/Memory and clear the cookie).

## References

- [IETF RFC 6749 — OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [IETF RFC 7636 — PKCE](https://datatracker.ietf.org/doc/html/rfc7636)
- [IETF RFC 6750 — Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [IETF RFC 6819 — OAuth 2.0 Threat Model](https://datatracker.ietf.org/doc/html/rfc6819)
- [Auth0 — Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
- [Auth0 — OAuth 2.0 Best Practices](https://auth0.com/resources/ebooks/best-practices-for-oauth-and-oidc)
