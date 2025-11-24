import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api'


export default function App(){
const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState('');


async function load(){
try{ const data = await getTasks(); setTasks(data); }catch(e){ console.error(e); }
}


useEffect(()=>{ load() }, []);


async function handleAdd(e){
e.preventDefault();
if(!title) return;
try{
await createTask({ title });
setTitle('');
await load();
}catch(e){ console.error(e); }
}


async function toggleDone(t){
try{
await updateTask(t.id, { status: t.status === 'done' ? 'todo' : 'done' });
await load();
}catch(e){ console.error(e); }
}


async function handleDelete(id){
try{
await deleteTask(id);
await load();
}catch(e){ console.error(e); }
}


return (
<div className="container">
<h1>Task Manager</h1>
<form onSubmit={handleAdd} className="row">
<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nueva tarea" />
<button type="submit">Agregar</button>
</form>


<ul className="tasks">
{tasks.map(t => (
<li key={t.id} className={t.status === 'done' ? 'done' : ''}>
<span>{t.title}</span>
<div className="actions">
<button onClick={()=>toggleDone(t)}>{t.status === 'done' ? 'Reabrir' : 'Hecho'}</button>
<button onClick={()=>handleDelete(t.id)}>Borrar</button>
</div>
</li>
))}
</ul>
</div>
)
}