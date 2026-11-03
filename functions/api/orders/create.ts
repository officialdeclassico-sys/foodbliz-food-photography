interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
}

interface PagesContext {
  request: Request;
  env: { DB: D1Database };
}

interface ProductRow {
  id: string;
  name: string;
  package_name: string | null;
  price: number;
  currency: string;
  is_active: number;
}

const json = (body: unknown, status = 200): Response =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function onRequestPost(context: PagesContext): Promise<Response> {
  let body: { name?: unknown; email?: unknown; phone?: unknown; productId?: unknown };

  try {
    body = await context.request.json();
  } catch {
    return json({ error: "A valid JSON request body is required." }, 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const productId = typeof body.productId === "string" ? body.productId.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return json({ error: "Please provide a name between 2 and 120 characters." }, 400);
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }
  if (phone && phone.length > 30) {
    return json({ error: "Phone number is too long." }, 400);
  }
  if (!productId || productId.length > 100) {
    return json({ error: "A valid productId is required." }, 400);
  }

  try {
    const product = await context.env.DB
      .prepare(
        `SELECT id, name, package_name, price, currency, is_active
         FROM products
         WHERE id = ? AND is_active = 1
         LIMIT 1`,
      )
      .bind(productId)
      .first<ProductRow>();

    if (!product) {
      return json({ error: "This package is unavailable. Please refresh and try again." }, 404);
    }

    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const orderReference = `FB-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    const now = new Date().toISOString();

    await context.env.DB.batch([
      context.env.DB
        .prepare(
          `INSERT INTO customers (id, name, email, phone, created_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET
             name = excluded.name,
             phone = COALESCE(excluded.phone, customers.phone)`,
        )
        .bind(customerId, name, email, phone, now),
      context.env.DB
        .prepare(
          `INSERT INTO orders (
             id, customer_id, order_reference, total_amount, currency,
             order_status, payment_status, created_at, updated_at
           )
           VALUES (
             ?, (SELECT id FROM customers WHERE email = ?), ?, ?, ?,
             'pending', 'pending', ?, ?
           )`,
        )
        .bind(orderId, email, orderReference, product.price, product.currency, now, now),
      context.env.DB
        .prepare(
          `INSERT INTO order_items (id, order_id, product_id, price, license_type, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(crypto.randomUUID(), orderId, product.id, product.price, product.package_name, now),
    ]);

    return json(
      {
        order: {
          id: orderId,
          reference: orderReference,
          status: "pending",
          paymentStatus: "pending",
          amount: product.price,
          currency: product.currency,
          product: {
            id: product.id,
            name: product.name,
            package: product.package_name,
          },
        },
        message: "Order created. Payment has not been initiated.",
      },
      201,
    );
  } catch {
    return json({ error: "We could not create your order. Please try again." }, 503);
  }
}
