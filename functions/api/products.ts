interface D1Result<T> {
  results: T[];
}

interface D1Statement {
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface PagesContext {
  env: { DB: D1Database };
}

interface PublicProduct {
  id: string;
  name: string;
  package_name: string | null;
  description: string | null;
  price: number;
  currency: string;
  media_type: string | null;
  preview_url: string | null;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  try {
    const { results } = await context.env.DB
      .prepare(
        `SELECT
          id,
          name,
          package_name,
          description,
          price,
          currency,
          media_type,
          preview_url
        FROM products
        WHERE is_active = 1
        ORDER BY created_at DESC`,
      )
      .all<PublicProduct>();

    return Response.json(
      { products: results },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Products are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
