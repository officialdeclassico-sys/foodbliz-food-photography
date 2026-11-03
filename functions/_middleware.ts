interface AccessClaims {
  aud?: string | string[];
  iss?: string;
  exp?: number;
}

interface Env {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  next(): Promise<Response>;
}

interface AccessCertificate {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  n: string;
  e: string;
}

interface AccessCertificates {
  keys: AccessCertificate[];
}

const json = (message: string, status: number): Response =>
  Response.json({ error: message }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJsonPart<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(value))) as T;
}

async function verifyAccessJwt(token: string, teamDomain: string, audience: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const header = decodeJsonPart<{ kid?: string; alg?: string }>(parts[0]);
    const claims = decodeJsonPart<AccessClaims>(parts[1]);
    if (!header.kid || header.alg !== "RS256") return false;

    const issuer = `https://${teamDomain}.cloudflareaccess.com`;
    if (claims.iss !== issuer || !claims.exp || claims.exp <= Math.floor(Date.now() / 1000)) return false;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audiences.includes(audience)) return false;

    const certificateResponse = await fetch(`${issuer}/cdn-cgi/access/certs`, {
      headers: { Accept: "application/json" },
    });
    if (!certificateResponse.ok) return false;
    const certificates = await certificateResponse.json() as AccessCertificates;
    const certificate = certificates.keys.find((key) => key.kid === header.kid && key.kty === "RSA");
    if (!certificate) return false;

    const publicKey = await crypto.subtle.importKey(
      "jwk",
      certificate as JsonWebKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const signedContent = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signatureBytes = decodeBase64Url(parts[2]);
    const signatureBuffer = new ArrayBuffer(signatureBytes.byteLength);
    new Uint8Array(signatureBuffer).set(signatureBytes);
    return await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signatureBuffer,
      signedContent,
    );
  } catch {
    return false;
  }
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const url = new URL(context.request.url);
  const isAdminApi = url.pathname.startsWith("/api/admin/");
  const isAdminPage = url.pathname === "/admin" || url.pathname.startsWith("/admin/");
  if (!isAdminApi && !isAdminPage) return context.next();

  const teamDomain = context.env.ACCESS_TEAM_DOMAIN;
  const audience = context.env.ACCESS_AUD;
  if (!teamDomain || !audience) {
    return json("Admin authentication is not configured.", 503);
  }

  const assertion = context.request.headers.get("CF-Access-Jwt-Assertion");
  if (!assertion || !(await verifyAccessJwt(assertion, teamDomain, audience))) {
    return json("Authentication required.", 401);
  }

  return context.next();
}
