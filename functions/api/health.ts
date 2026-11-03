interface D1Statement {
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface PagesContext {
  env: { DB: D1Database };
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  try {
    const result = await context.env.DB.prepare("SELECT 1 AS ok").first<{ ok: number }>();

    if (result?.ok !== 1) {
      throw new Error("Database health check returned an unexpected result.");
    }

    return Response.json(
      { status: "ok", service: "foodbliz-api", database: "connected" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "error", service: "foodbliz-api", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
