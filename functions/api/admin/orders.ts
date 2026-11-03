interface D1Database {
  prepare(query: string): {
    bind(...values: unknown[]): {
      all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
    };
  };
}
interface PagesContext {
  request: Request;
  env: { DB: D1Database; ADMIN_API_SECRET?: string };
}
export async function onRequestGet(context: PagesContext): Promise<Response> {
  const secret = context.env.ADMIN_API_SECRET;
  if (!secret) return Response.json({ error: "Admin API is not configured." }, { status: 503 });
  if (context.request.headers.get("Authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const url = new URL(context.request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 25), 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT o.id, o.order_reference, o.order_status, o.payment_status,
              o.total_amount, o.currency, o.created_at,
              c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
              p.name AS product_name, p.package_name
       FROM orders o
       INNER JOIN customers c ON c.id = o.customer_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();
    return Response.json({ orders: results, limit, offset }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Orders are temporarily unavailable." }, { status: 503 });
  }
}
