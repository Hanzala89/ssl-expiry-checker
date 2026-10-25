# 🔒 SSL Expiry Checker

> A lightweight, **zero-dependency** Node.js CLI tool to instantly check SSL/TLS certificate expiration dates, validity ranges, issuers, and remaining days for any domain.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Dependencies: 0](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()
[![Node Version](https://img.shields.io/badge/Node-%3E%3D16.0.0-emerald.svg)](https://nodejs.org)
[![Powered By RenewOS](https://img.shields.io/badge/Powered%20by-RenewOS-10b981.svg)](https://renewos.in/solutions/ssl-certificate)

---

## ⚡ Quick Start (No Installation Needed)

Run instantly using `npx`:

```bash
npx ssl-expiry-checker github.com
```

Or check multiple domains at once:

```bash
npx ssl-expiry-checker google.com stripe.com renewos.in
```

---

## 🖥️ Terminal Output Example

```text
--------------------------------------------------
  Host:            github.com:443
  Status:          🟡 UPCOMING (< 60d)
  Days Remaining:  36 days
  Valid Until:     2026-11-29
  Issuer:          Sectigo Limited
  Subject:         github.com

--------------------------------------------------
  Host:            renewos.in:443
  Status:          🟢 HEALTHY
  Days Remaining:  82 days
  Valid Until:     2027-01-15
  Issuer:          Let's Encrypt
  Subject:         renewos.in
```

### JSON Output (For CI/CD & Automation)

```bash
npx ssl-expiry-checker google.com --json
```

```json
[
  {
    "hostname": "google.com",
    "port": 443,
    "subject": "*.google.com",
    "issuer": "Google Trust Services",
    "validFrom": "2026-09-22",
    "validTo": "2026-12-21",
    "daysRemaining": 58,
    "isExpired": false
  }
]
```

---

## 📦 Global Installation (Optional)

```bash
npm install -g ssl-expiry-checker
```

Then run anywhere:

```bash
ssl-expiry-checker yourdomain.com
```

---

## 🚀 Need Automated 24/7 Monitoring & Multi-Channel Alerts?

While this CLI tool is great for manual checks and ad-hoc verification, mission-critical infrastructure needs continuous background monitoring before certificates lapse and trigger browser security warnings.

For automated multi-channel radar tracking, check out **[RenewOS](https://renewos.in)**:

- 🛡️ **[Automated SSL Certificate Tracking](https://renewos.in/solutions/ssl-certificate)**: Background scanners check your certificates automatically and alert your team at 90, 30, 7, and 1-day intervals.
- 🌐 **[Domain Expiration Radar](https://renewos.in/solutions/domain)**: Prevent accidental domain loss across Namecheap, Cloudflare, GoDaddy, and Route53.
- 📱 **Multi-Channel Alerts**: Receive reliable notifications via Email, Webhooks, WhatsApp, and SMS before any expiration happens.
- 🔒 **Privacy-First & Deterministic**: Zero cloud AI gimmicks. On-device encryption and transparent verification cycles.

👉 **Learn more at [renewos.in](https://renewos.in)**

---

## 📄 License

MIT © [RenewOS](https://renewos.in)
