# Foodbliz admin authentication — Cloudflare Access

Foodbliz admin API routes are protected by `functions/_middleware.ts`. The middleware validates the Cloudflare Access JWT signature, issuer, expiry, and Access application audience before allowing requests to `/api/admin/*`.

## Cloudflare configuration still required

1. In Cloudflare Zero Trust, create an Access application for the admin URL/path you intend to protect (for example, `foodbliz.com/api/admin/*`).
2. Add an Access policy that permits only the intended administrators. Prefer a narrowly scoped email allowlist or your organization's identity provider group.
3. Copy the Access application's **AUD tag**.
4. In the Foodbliz Pages project's **Production** environment variables, set:
   - `ACCESS_TEAM_DOMAIN`: your Cloudflare Zero Trust team name only (the subdomain before `.cloudflareaccess.com`, not a URL).
   - `ACCESS_AUD`: the Access application's AUD tag.
5. Redeploy the Pages project.

Do not put either value in frontend JavaScript. These are server-side Pages environment variables. The AUD tag is not a password, but it must match the Access application exactly.

## Admin endpoints

- `GET /api/admin/orders?limit=25&offset=0`
- `PATCH /api/admin/orders/:orderId` with JSON body `{"orderStatus":"processing"}`

The Access middleware rejects missing or invalid assertions. The order handlers do not accept a browser-supplied admin bearer secret.

## Important

- Configure the Access application and its allow policy before considering the admin API ready.
- Confirm the production Access policy and test both an authorized administrator and an unauthenticated visitor.
- Do not expose an admin dashboard until this is configured and tested.
- Order status and payment status are separate. Marking an order completed does not prove payment; payment status must be changed only by verified payment-provider events.
- This middleware validates the JWT cryptographically, but Cloudflare Access policy is responsible for deciding who may obtain a valid assertion.
