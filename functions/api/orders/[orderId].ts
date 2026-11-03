interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface PagesContext {
  request: Request;
  env: { DB: { prepare(query: string): D1PreparedStatement } };
  params: { orderId: string };
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const orderId = context.params.orderId;
  if (!orderId || orderId.length > 100) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  try {
    const order = await context.env.DB
      .prepare(
        `SELECT
           o.order_reference,
           o.order_status,
           o.payment_status,
           o.total_amount,
           o.currency,
           o.created_at,
           p.name AS product_name,
           p.package_name
         FROM orders o
         INNER JOIN order_items oi ON oi.order_id = o.id
         INNER JOIN products p ON p.id = oi.product_id
         WHERE o.id = ?
         LIMIT 1`,
      )
      .bind(orderId)
      .first<{
        order_reference: string;
        order_status: string;
        payment_status: string;
        total_amount: number;
        currency: string;
        created_at: string;
        product_name: string;
        package_name: string | null;
      }>();

    if (!order) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    return Response.json(
      {
        order: {
          reference: order.order_reference,
          status: order.order_status,
          paymentStatus: order.payment_status,
          amount: order.total_amount,
          currency: order.currency,
          createdAt: order.created_at,
          product: { name: order.product_name, package: order.package_name },
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "Order status is temporarily unavailable." }, { status: 503 });
  }
}
