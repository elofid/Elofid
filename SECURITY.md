# Security Policy

Elofid builds security tools, and we hold our own systems to the same standard. We take every report seriously and appreciate the work of researchers who help keep our users safe.

## Supported versions

Elofid is continuously deployed. Only the current production version at [elofid.com](https://elofid.com) and its related services receive security updates.

## Reporting a vulnerability

**Please do not report vulnerabilities through public GitHub issues, Telegram groups, X or any other public channel.**

Report privately through one of these channels:

1. **GitHub [Private Vulnerability Reporting](../../security/advisories/new)** for this repository (preferred)
2. **Email:** [security@elofid.com](mailto:security@elofid.com) with the subject line **"Security Report"**

A good report includes:

- A clear description of the vulnerability
- The affected page, feature, contract, API endpoint or component
- Steps to reproduce the issue
- The potential security impact
- Screenshots, logs or a proof of concept, when relevant

## What to expect

| Stage | Target |
| --- | --- |
| Acknowledgement of your report | Within 72 hours |
| Initial assessment and status update | Within 7 days |
| Fix or mitigation | Depends on severity and complexity. Critical issues are prioritized. |

We will keep you informed while we investigate. With your permission, we are happy to credit you once the issue is resolved.

## Scope

### In scope

- The Elofid website and **Security Hub** (Quick Scan, Deep Intelligence, Tx Decoder, RPC Health Checker)
- **Firewall**, including Wallet Watch and Wallet Passport
- **Scanner Bot** on Telegram
- **Developer API**, Continuous Monitoring and webhooks
- Related public infrastructure on elofid.com and its subdomains

### Out of scope

- Denial of service, load testing or request flooding
- Social engineering, phishing or physical attacks against Elofid or its users
- Reports from automated scanners without a demonstrated, practical impact
- Missing security headers or best-practice suggestions without a concrete exploit
- Issues in third-party services, blockchain networks, wallets, exchanges or external APIs that Elofid does not control
- Scan results that you believe are inaccurate. Please send those to [support@elofid.com](mailto:support@elofid.com) as regular feedback.

## Rules of engagement

- Test only against your own accounts, wallets and data.
- Do not access, modify, delete or expose data that does not belong to you.
- Do not degrade the service for other users.
- Give us reasonable time to investigate and fix an issue before any public disclosure.

## Safe harbor

We will not pursue legal action against researchers who act in good faith, follow this policy, avoid harm to users and data, and give us a reasonable opportunity to resolve the issue before disclosure.

## Rewards

We value every valid report. Submitting a report does not guarantee a reward or bounty. Any recognition is at the discretion of Elofid.

## Beware of impersonation

Elofid will never contact you first, and will never ask for a seed phrase, a private key or a wallet signature to "fix" a security problem. If someone does, it is a scam.

---

**Elofid** · [elofid.com](https://elofid.com) · [security@elofid.com](mailto:security@elofid.com)
