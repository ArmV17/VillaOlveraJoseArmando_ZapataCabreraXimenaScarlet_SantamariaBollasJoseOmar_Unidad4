const API_BASE = import.meta.env.VITE_API_URL || '';


async function request(path, opts = {}) {
const res = await fetch(`${API_BASE}${path}`, {
headers: { 'Content-Type': 'application/json' },
...opts
});
if (res.status === 204) return null;
const data = await res.json();
if (!res.ok) throw data;
return data;
}


export const getTasks = () => request('/tasks');
export const createTask = (t) => request('/tasks', { method: 'POST', body: JSON.stringify(t) });
export const updateTask = (id, fields) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(fields) });
export const deleteTask = (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });