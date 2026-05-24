# Cloudflare Security & WAF Configuration Guide

To ensure the ERP is protected against DDoS, bot attacks, and zero-day vulnerabilities, apply the following settings in your Cloudflare dashboard.

## 1. Security Settings
- **Security Level:** High
- **Bot Fight Mode:** ON
- **Browser Integrity Check:** ON
- **Always Use HTTPS:** ON
- **HSTS:** Enabled (Max-Age: 12 months, Include Subdomains, Preload)

## 2. Web Application Firewall (WAF) Rules
Create the following custom WAF rules:

**Rule 1: Block Non-Domestic Traffic to Admin/Teacher APIs**
- *Field:* URI Path
- *Operator:* starts with `/api/admin` OR starts with `/api/settings`
- *AND Field:* Country
- *Operator:* is not in `[Your Primary Country]`
- *Action:* Block

**Rule 2: Protect Login from Brute Force**
- *Field:* URI Path
- *Operator:* equals `/api/login`
- *Action:* Managed Challenge (or Rate Limit to 5 req/min)

**Rule 3: Block Suspicious User Agents & Threat Intel**
- *Field:* Known Bots
- *Operator:* equals `Off`
- *AND Field:* Threat Score
- *Operator:* greater than `10`
- *Action:* Block

## 3. Rate Limiting Rules
- **API Endpoints (`/api/*`):** Allow 100 requests per 1 minute per IP. Block for 1 hour.
- **Auth Endpoints (`/api/login`, `/api/register`):** Allow 5 requests per 1 minute per IP. Block for 1 hour.

## 4. Page Rules
- **Rule 1: `*codebyvishu.in/api/*`**
  - Cache Level: Bypass
  - Disable Performance Features
  - *Reason:* APIs should never be cached to prevent serving stale or cross-user data.

- **Rule 2: `*codebyvishu.in/*`**
  - Cache Level: Cache Everything
  - Edge Cache TTL: 2 hours
  - *Reason:* Cache the React frontend aggressively.
