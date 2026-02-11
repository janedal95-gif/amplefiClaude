# Amplefi Application - Lead Developer README

This repository contains the Amplefi marketing web app and serverless lead capture platform.

The system has two production-relevant parts:
- `react-app/`: Public marketing site (Vite + React) with CTA forms.
- `backend/amplefi-backend/`: AWS SAM project (API Gateway + Lambda + DynamoDB + SES) handling leads, subscriptions, and unsubscribe links.

There are also legacy/prototype directories in this repo. See `Repository Layout` below before making changes.

## 1) Product and System Scope

The current application supports:
- Landing page content and CTA flow (`Request a Demo` modal).
- Lead intake (`POST /lead`), persistence, and internal notification emails.
- Newsletter subscribe intake (`POST /subscribe`), persistence, and internal notification emails.
- Customer-facing auto-reply emails with secure unsubscribe links.
- Unsubscribe endpoint (`GET /unsubscribe`) that marks subscribers as `unsubscribed`.
- Frontend metadata tracking fields (UTM + path + user agent + client timestamp).

## 2) High-Level Architecture

```text
Browser (react-app)
  -> POST /lead, /subscribe (API Gateway HTTP API)
      -> Lambda (lead.js / subscribe.js)
          -> DynamoDB (LeadsTable, SubscribersTable)
          -> SES (customer auto-reply + internal notify emails)

Browser / Email link click
  -> GET /unsubscribe?email=...&token=...
      -> Lambda (unsubscribe.js)
          -> HMAC token verification
          -> DynamoDB update status=unsubscribed
```

Infra source of truth:
- `backend/amplefi-backend/template.yaml`
- `backend/amplefi-backend/samconfig.toml`
- `amplify.yml` (frontend CI/CD)

## 3) Repository Layout (Active vs Legacy)

### Active paths
- `react-app/`
- `backend/amplefi-backend/`
- `amplify.yml`

### Legacy or duplicate paths (do not treat as source of truth unless intentionally reviving)
- `backend/src/` and `backend/template.yaml`: older simpler Lambda implementation without unsubscribe function and expanded SES flow.
- `react-app/lambda/index.mjs`: standalone SES Lambda prototype, not wired to current SAM backend.
- `index.html` (repo root): static HTML version of landing page, not the React app build target.

## 4) Frontend Application (`react-app/`)

### Framework and tooling
- React 19 + Vite 7
- ESLint 9 flat config
- CSS modules by component

Key files:
- Entry: `react-app/src/main.jsx`
- App composition: `react-app/src/App.jsx`
- API client: `react-app/src/lib/api.js`
- Lead modal: `react-app/src/components/ContactModal.jsx`
- Footer subscribe form: `react-app/src/components/Footer.jsx`

### Runtime configuration
- `VITE_API_BASE_URL` must point at deployed HTTP API base URL.
- Local example currently stored in `react-app/.env.local`:
  - `VITE_API_BASE_URL=https://brv2v7x1y9.execute-api.us-east-1.amazonaws.com`

### Client tracking payload enrichment
`react-app/src/lib/api.js` appends the following fields to both lead and subscribe requests:
- `pagePath`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `userAgent`
- `timestamp`

## 5) Backend Application (`backend/amplefi-backend/`)

### Runtime
- Node.js 20.x Lambdas
- AWS SDK v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/client-ses`)

### AWS resources (SAM)
- HTTP API
- `LeadsTable` (PK: `id`)
- `SubscribersTable` (PK: `email`)
- `LeadFunction` -> `POST /lead`
- `SubscribeFunction` -> `POST /subscribe`
- `UnsubscribeFunction` -> `GET /unsubscribe`

Defined in:
- `backend/amplefi-backend/template.yaml`

### Lambda behaviors

#### `lead.handler` (`backend/amplefi-backend/src/lead.js`)
- Validates `fullName` and `workEmail`.
- Honeypot field `company_website`: silently accepted with `200` and no write.
- Persists lead record to `LeadsTable`.
- Checks subscriber status by email:
  - If unsubscribed, skips customer auto-reply.
  - Otherwise sends demo acknowledgment email.
- Always attempts internal notification email to configured team recipients.

#### `subscribe.handler` (`backend/amplefi-backend/src/subscribe.js`)
- Validates `email`.
- Honeypot behavior matches lead endpoint.
- Reads existing subscriber status:
  - If `unsubscribed`, does not overwrite status and does not send customer auto-reply.
  - Otherwise writes/upserts `status=subscribed` and sends welcome email.
- Always attempts internal notification email.

#### `unsubscribe.handler` (`backend/amplefi-backend/src/unsubscribe.js`)
- Accepts `email` and `token` query parameters.
- Recomputes HMAC-SHA256 token (`base64url`) using `UNSUB_SECRET`.
- Uses timing-safe token compare.
- On success sets subscriber status to `unsubscribed` and `unsubscribedAt`.
- Returns simple HTML response page for success/failure.

## 6) API Contract

Base URL:
- From SAM output `ApiUrl`, example:
  - `https://{api-id}.execute-api.us-east-1.amazonaws.com`

### `POST /lead`
Request body:
```json
{
  "fullName": "Jane Smith",
  "workEmail": "jane@hospital.org",
  "title": "COO",
  "organization": "Example Medical Center",
  "message": "Need better discharge coordination",
  "company_website": "",
  "pagePath": "/",
  "utm_source": "linkedin",
  "utm_medium": "paid",
  "utm_campaign": "q1-demo",
  "utm_term": "",
  "utm_content": "",
  "userAgent": "Mozilla/5.0 ...",
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```
Responses:
- `201`: `{"message":"Lead stored."}`
- `400`: validation errors
- `500`: internal error

### `POST /subscribe`
Request body:
```json
{
  "email": "person@example.com",
  "company_website": "",
  "pagePath": "/",
  "utm_source": "newsletter",
  "utm_medium": "organic",
  "utm_campaign": "spring",
  "utm_term": "",
  "utm_content": "",
  "userAgent": "Mozilla/5.0 ...",
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```
Responses:
- `201`: `{"message":"Subscribed."}`
- `400`: validation errors
- `500`: internal error

### `GET /unsubscribe`
Query:
- `email` (lowercase email expected)
- `token` (HMAC SHA256 base64url)

Responses:
- `200` HTML page: unsubscribed
- `400` HTML page: invalid link/token

## 7) Configuration Matrix

### SAM parameters (`template.yaml`)
- `AllowedOrigins`: comma-delimited CORS allowlist.
- `FromEmail`: SES sender address for auto-replies/internal notifications.
- `NotifyEmails`: comma-separated internal recipient list.
- `UnsubSecret`: secret for unsubscribe token signing.

### Lambda environment variables
- `LEADS_TABLE`
- `SUBSCRIBERS_TABLE`
- `FROM_EMAIL`
- `NOTIFY_EMAILS`
- `UNSUB_SECRET`

### Current deployment defaults
See `backend/amplefi-backend/samconfig.toml` for default stack name/region and parameter overrides.

## 8) Local Development

### Prerequisites
- Node.js 20+
- npm
- AWS SAM CLI
- Docker (for `sam local` Lambda emulation)
- AWS credentials configured for deploy/log commands

### Frontend local run
```bash
cd react-app
npm ci
npm run dev
```
Default Vite URL:
- `http://localhost:5173`

### Backend local run
```bash
cd backend/amplefi-backend
sam build
sam local start-api
```

Local API base for frontend:
- Set `react-app/.env.local` to `VITE_API_BASE_URL=http://127.0.0.1:3000`

Notes:
- Local SES send attempts may fail without valid AWS credentials/permissions.
- Ensure CORS allows your local frontend origin.

## 9) Deployment

### Backend (SAM)
Initial guided deploy:
```bash
cd backend/amplefi-backend
sam build
sam deploy --guided
```

Subsequent deploy:
```bash
cd backend/amplefi-backend
sam build
sam deploy
```

Post-deploy:
- Capture `ApiUrl` output.
- Update frontend `VITE_API_BASE_URL` environment in Amplify/local env files as needed.

### Frontend (AWS Amplify)
Build definition is in `amplify.yml`:
- `appRoot: react-app`
- `npm ci`
- `npm run build`
- publish `react-app/dist`
- sets response security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)

## 10) Operational Runbook

### Logs
Tail Lambda logs:
```bash
cd backend/amplefi-backend
sam logs -n LeadFunction --stack-name amplefi-backend --tail
sam logs -n SubscribeFunction --stack-name amplefi-backend --tail
sam logs -n UnsubscribeFunction --stack-name amplefi-backend --tail
```

### Manual endpoint checks
```bash
curl -X POST "$API_BASE/lead" -H "Content-Type: application/json" -d '{"fullName":"Test","workEmail":"test@example.com"}'
curl -X POST "$API_BASE/subscribe" -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

For unsubscribe links, generate a valid token using the same HMAC secret used by backend and verify DB status update.

### Common failure modes
- `500` on lead/subscribe:
  - Missing IAM permissions to DynamoDB or SES.
  - SES sender identity/domain not verified in region.
  - Wrong/missing env vars.
- Browser CORS errors:
  - Origin missing from `AllowedOrigins` SAM parameter.
- Unsubscribe links always invalid:
  - `UNSUB_SECRET` mismatch between token generator and deployed Lambda.
  - Token generated for differently cased email than link email.

## 11) Security and Compliance Notes

- Unsubscribe token uses HMAC + timing-safe comparison (good baseline).
- Honeypot field blocks basic bot spam without challenging real users.
- Input validation currently enforces email shape and required fields but does not sanitize storage (acceptable for DynamoDB text storage).
- SES from address should be controlled and verified; avoid using unverified defaults in production.
- `UnsubSecret` should be rotated and stored securely (for example via secrets manager/parameter store, not plaintext defaults).

## 12) Current Technical Debt / Follow-up Recommendations

1. Eliminate duplicate backend code in `backend/src/` and `backend/template.yaml` to reduce operator confusion.
2. Replace hard-coded `UNSUBSCRIBE_BASE_URL` in `lead.js` and `subscribe.js` with environment variable (derived from deployed API URL).
3. Add automated tests (unit tests for handlers + integration tests for API contract and unsubscribe token flow).
4. Add CI checks for lint/build/test and pre-deploy validation.
5. Standardize environment management (`.env.example` files for frontend/backend).
6. Remove or archive legacy `index.html` and `react-app/lambda/index.mjs` if not needed.

## 13) Quick Start for a New Lead Dev

1. Read this file fully.
2. Confirm target environments and AWS accounts.
3. Deploy backend from `backend/amplefi-backend` and capture `ApiUrl`.
4. Configure frontend `VITE_API_BASE_URL` for local and Amplify environments.
5. Run end-to-end smoke test:
   - Submit demo form.
   - Submit subscribe form.
   - Verify DynamoDB writes.
   - Verify internal emails and customer auto-replies.
   - Verify unsubscribe link updates status and suppresses future customer emails.

## 14) File Reference Index

- Frontend app: `react-app/src/App.jsx`
- Frontend API client: `react-app/src/lib/api.js`
- Demo modal form: `react-app/src/components/ContactModal.jsx`
- Footer subscribe form: `react-app/src/components/Footer.jsx`
- Backend SAM template: `backend/amplefi-backend/template.yaml`
- Backend deploy config: `backend/amplefi-backend/samconfig.toml`
- Lead Lambda: `backend/amplefi-backend/src/lead.js`
- Subscribe Lambda: `backend/amplefi-backend/src/subscribe.js`
- Unsubscribe Lambda: `backend/amplefi-backend/src/unsubscribe.js`
- Amplify build config: `amplify.yml`

