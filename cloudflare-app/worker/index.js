// worker/index.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Cloudflare Worker + D1 — API activa", { status: 200 });
    }

    if (url.pathname === "/todos") {
      if (request.method === "GET") {
        // obtener todos
        const res = await env.DB.prepare("SELECT id, title, done FROM todos ORDER BY id DESC").all();
        return new Response(JSON.stringify(res.results || []), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (request.method === "POST") {
        const data = await request.json().catch(() => ({}));
        const title = data.title ? String(data.title).slice(0, 255) : "";
        if (!title) return new Response(JSON.stringify({ error: "title is required" }), { status: 400 });
        const stmt = await env.DB.prepare("INSERT INTO todos (title, done) VALUES (?, ?)").bind(title, 0).run();
        // obtener rowid insertado
        const id = stmt.lastInsertRowid || null;
        const row = { id, title, done: 0 };
        return new Response(JSON.stringify(row), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      return new Response("Method not allowed", { status: 405 });
    }

    return new Response("Not found", { status: 404 });
  }
};
