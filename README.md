<div align="center">

<img src="assets/elofid-logo.png" alt="Elofid" width="112" />

# Elofid

**On-chain security tools for wallets, tokens and communities.**

See what a token, a contract or a wallet permission can really do, before you sign, buy or connect.

[![Website](https://img.shields.io/badge/Website-elofid.com-22d3ee?style=flat-square)](https://elofid.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Scanner%20Bot-6366f1?style=flat-square&logo=telegram&logoColor=white)](https://t.me/ElofidBot)
[![X](https://img.shields.io/badge/X-@ElofidNetwork-0f172a?style=flat-square&logo=x&logoColor=white)](https://x.com/ElofidNetwork)
[![Security Policy](https://img.shields.io/badge/Security-Policy-8b5cf6?style=flat-square)](SECURITY.md)

</div>

---

## Why Elofid

Most losses in Web3 are not dramatic hacks. They come from tokens that cannot be sold, taxes hidden in a contract, forgotten wallet approvals and transactions whose real effect was never clear.

Elofid reads the blockchain directly, simulates what would happen before anything is signed, and presents the result in plain language. Every figure is either verified on-chain or clearly marked as unverified.

## Products

| Product | What it does |
| --- | --- |
| **[Security Hub](https://elofid.com/security)** | Multi-chain token and contract scanner. Contract controls, liquidity, LP lock and burn evidence, holder concentration and market structure. No wallet connection required. |
| **Deep Intelligence** | Advanced analysis inside the Security Hub. A real buy and sell simulation through the token's own DEX router detects honeypots and measures buy, sell and transfer tax. Also covers deployer history, early buyers, shared-funding wallets, LP lock expiry and ownership history. |
| **[Scanner Bot](https://t.me/ElofidBot)** | The same engine inside Telegram. Paste a contract address and get a structured security report with a live buy and sell simulation, buy, sell and transfer tax, contract risks, DEX and CEX liquidity, holder analysis and Exit Path. Works in private chats and groups. |
| **Firewall** | Wallet protection. Blast Radius maps every active approval, Fix Mode guides revocation, Wallet Watch alerts on new approvals, and Wallet Passport issues a signed, wallet-bound security record. |
| **Continuous Monitoring** | Every monitored token is re-checked on a schedule. Meaningful changes become security Events, and related Events are correlated into Incidents. |
| **Developer API** | Programmatic access to monitoring, security events, incidents, watchlists and signed webhooks. |

The Security Hub also includes a **Tx Decoder**, which turns a transaction into a readable preview before it is signed, and an **RPC Health Checker**, which flags unhealthy or suspicious network endpoints.

## How we report risk

Every Elofid product follows the same rules.

- **Unknown is never shown as clean.** If a data source fails or coverage is incomplete, the report says so and explains why. A missing value is never displayed as zero, "none" or "safe".
- **On-chain verification is marked.** Figures read directly from the blockchain are labeled as verified. Figures from third-party providers are labeled by source.
- **Simulations never touch real funds.** Buy, sell and transfer tests run as read-only simulations. Nothing is broadcast and nothing is signed.
- **Context, not accusations.** Signals such as a fresh deployer wallet or shared funding are shown as evidence to review, with the reasoning visible.
- **No secrets in the browser.** Scans never ask for a seed phrase or a wallet signature, and provider keys stay server-side.

## Supported networks

| EVM | | | Non-EVM |
| --- | --- | --- | --- |
| BNB Smart Chain | Ethereum | Base | Solana |
| Arbitrum | Polygon | Optimism | |
| Avalanche | Linea | Scroll | |
| opBNB | Robinhood Chain | | |

## What monitoring detects

| Area | Events |
| --- | --- |
| Liquidity and exit | `liquidity_collapse`, `exit_depth_collapse`, `exit_depth_deterioration` |
| Market and score | `price_collapse`, `score_deterioration` |
| Trading and tax | `honeypot_risk`, `sell_blocked`, `buy_blocked`, `tax_spike`, `tax_changed`, `tax_reduced` |
| Contract control | `mint_authority_risk`, `freeze_authority_risk`, `pause_risk`, `proxy_implementation_changed` |
| Ownership | `owner_changed`, `owner_renounced`, `owner_restored_after_renounce` |
| Supply | `supply_increase`, `supply_decrease` |
| Deployer | `deployer_large_sell` |

Related Events are grouped into Incidents. Webhooks deliver `elofid.incident.created`, `elofid.incident.updated` and `elofid.incident.resolved`.

## Developer API

```bash
curl https://api.elofid.com/v1/health

curl https://api.elofid.com/v1/incidents \
  -H "Authorization: Bearer <API_KEY>"
```

| Endpoint | Description |
| --- | --- |
| `GET /v1/health` | Service status |
| `GET /v1/monitoring/assets/:chain/:token/events` | Security events for a monitored asset |
| `GET /v1/monitoring/assets/:chain/:token/incidents` | Incidents for a monitored asset |
| `GET /v1/events` · `GET /v1/incidents` | Account-wide feeds |
| `/v1/watchlists` | Manage monitored assets |
| `GET /v1/webhooks` · `POST /v1/webhooks` | Webhook delivery |
| `GET /v1/usage` | Current usage (does not count toward quota) |

| Plan | API calls / month | History |
| --- | --- | --- |
| Free | 10,000 | 7 days |
| Starter | 50,000 | 30 days |
| Growth | 250,000 | 60 days |
| Pro | 1,000,000 | 90 days |
| Enterprise | Custom | Custom |

Every plan, including Free, uses an API key. A workspace keeps one persistent key that starts with `elo_live_`, and changing plans keeps the same key. Only authenticated customer calls count toward the monthly quota.

Webhooks are signed with HMAC-SHA256. The `Elofid-Signature` header is `v1=<hex>`, an HMAC of `<Elofid-Timestamp>.<raw body>` with your `whsec_` secret. Use `Elofid-Delivery-Id` to ignore duplicate deliveries.

Read more in the **[Whitepaper](https://elofid.com/whitepaper.pdf)** and the **[FAQ](https://elofid.com/FAQ.pdf)**.

## Official channels

| Channel | Link |
| --- | --- |
| Website | [elofid.com](https://elofid.com) |
| Support | [support@elofid.com](mailto:support@elofid.com) |
| Security reports | [security@elofid.com](mailto:security@elofid.com) |
| Telegram Scanner Bot | [@ElofidBot](https://t.me/ElofidBot) |
| Official Telegram | [@elofid_official](https://t.me/elofid_official) |
| Community | [@elofidcommunity](https://t.me/elofidcommunity) |
| X | [@ElofidNetwork](https://x.com/ElofidNetwork) |

> **Admins will never message you first.** Elofid will never ask for a seed phrase or a private key. Treat any such message as a scam.

## Security

Found a vulnerability? Please follow our **[Security Policy](SECURITY.md)** and report it privately. Do not open a public issue.

## Disclaimer

Scores, signals and warnings are informational only. They are not an audit, financial advice or a guarantee of safety. Security scans reduce risk but cannot eliminate it.

<div align="center">

**Elofid · Security that starts before the loss.**

</div>
