
// worker/index.js
export default {
async fetch(request, env) {
const url = new URL(request.url);
const pathname = url.pathname.replace(/\/$/, '');
const method = request.method;


if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders() });


try {
if (pathname === '/tasks' && method === 'GET') {
const res = await env.DB.prepare(`SELECT * FROM tasks ORDER BY created_at DESC`).all();
return json(res.results);
}


if (pathname === '/tasks' && method === 'POST') {
const body = await request.json();
const { title, description = '', priority = 1, due_date = null } = body;
if (!title) return json({ error: 'title required' }, 400);
const r = await env.DB.prepare(
`INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)`
).run(title, description, priority, due_date);
const id = r.lastInsertRowid;
const newTask = (await env.DB.prepare(`SELECT * FROM tasks WHERE id = ?`).all(id)).results[0];
return json(newTask, 201);
}


const match = pathname.match(/^\/tasks\/(\d+)$/);
if (match) {
const id = Number(match[1]);
if (method === 'GET') {
const r = await env.DB.prepare(`SELECT * FROM tasks WHERE id = ?`).all(id);
if (!r.results.length) return json({ error: 'Not found' }, 404);
return json(r.results[0]);
}
if (method === 'PUT' || method === 'PATCH') {
const body = await request.json();
const fields = [];
const values = [];
for (const key of ['title','description','status','priority','due_date']) {
if (body[key] !== undefined) {
fields.push(`${key} = ?`);
values.push(body[key]);
}
}
if (!fields.length) return json({ error: 'No fields to update' }, 400);
values.push();
// update timestamp using SQLite function
const updateSql = `UPDATE tasks SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;
values.push(id);
await env.DB.prepare(updateSql).run(...values);
const updated = (await env.DB.prepare(`SELECT * FROM tasks WHERE id = ?`).all(id)).results[0];
return json(updated);
}
if (method === 'DELETE') {
await env.DB.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
return new Response(null, { status: 204, headers: corsHeaders() });
}
}


return json({ error: 'Not found' }, 404);
} catch (err) {
return json({ error: err.message }, 500);
}
}
}