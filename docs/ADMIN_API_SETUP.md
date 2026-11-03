# Foodbliz admin API setup

The admin order endpoints are intentionally disabled until a secret is configured in Cloudflare Pages.

## Configure the secret

1. Open the Cloudflare dashboard and select the **foodbliz** Pages project.
2. Open **Settings → Variables and Secrets**.
3. Under **Production**, add a secret named `ADMIN_API_SECRET`.
4. Generate a long, random value (at least 32 bytes of randomness) in a password manager.
5. Save it as a **Secret**, not a plain-text variable.
6. Redeploy the Pages project so the Functions runtime receives the new secret.

Do not commit the secret to GitHub, put it in frontend code, or share it in chat.

## Admin API authentication

Send the secret only from a trusted server-side admin client using:

```http
Authorization: Bearer <ADMIN_API_SECRET>
```

Endpoints:
- `GET /api/admin/orders?limit=25&offset=0`
- `PATCH /api/admin/orders/:orderId`

Allowed order statuses: `pending`, `processing`, `completed`, `cancelled`.

## Important security limitation

The current Foodbliz website does not yet have an implemented admin login/session system. Do not expose the secret in browser JavaScript or store it in local storage. Do not build a public browser-based admin screen around this bearer-secret API. Before launching an admin dashboard, implement proper server-managed authentication and authorization (for example, a secure session backed by an identity provider), then have the dashboard call the admin APIs through that authenticated session.

Payment status is separate from order status. Updating an order to `completed` does not prove that payment was received. Payment status must only be changed by a verified payment provider flow/webhook.
