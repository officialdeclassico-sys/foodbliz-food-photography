interface D1Database {
  prepare(query: string): {
    bind(...values: unknown[]): {
      run(): Promise<{ meta?: { changes?: number } }>;
    };
  };
}
interface PagesContext {
  request: Request;
  env: { DB: D1Database; ADMIN_API_SECRET?: string };
  params: { orderId: string };
}
export async function onRequestPatch(context: PagesContext): Promise<Response> {
  const secret = context.env.ADMIN_API_SECRET;
  if (!secret) {
    return Response.json({ error: "Admin API is not configured." }, { status: 503 });
  }
  if (context.request.headers.get("Authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  const orderId = context.params.orderId;
  if (!orderId || orderId.length > 100) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }
  let body: { orderStatus?: unknown };
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "A valid JSON request body is required." }, { status: 400 });
  }
  const allowedStatuses = ["pending", "processing", "completed", "cancelled"];
  if (typeof body.orderStatus !== "string" || !allowedStatuses.includes(body.orderStatus)) {
    return Response.json({ error: "Invalid order status." }, { status: 400 });
  }
  try {
    const result = await context.env.DB.prepare(
      "UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(body.orderStatus, orderId).run();
    if (result.meta?.changes === 0) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }
    return Response.json(
      { message: "Order status updated.", orderId, orderStatus: body.orderStatus },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json({ error: "Order status could not be updated." }, { status: 503 });
  }
}
