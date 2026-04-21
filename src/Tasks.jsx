import { useEffect, useState } from "react";

export default function Tasks({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API = "http://localhost:3000/api";

  const loadTasks = async () => {
    const res = await fetch(`${API}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = async (id) => {
    const newTitle = prompt("Nuevo título:");
    if (!newTitle) return;

    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: newTitle })
    });

    const updated = await res.json();

    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div>
      <div className="row">
        <input
          value={title}
          placeholder="Nueva tarea..."
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="btn-primary" onClick={addTask}>
          Agregar
        </button>
      </div>

      {tasks.map((t) => (
        <div className="task" key={t.id}>
          <span>{t.title}</span>

          <div className="row">
            <button onClick={() => editTask(t.id)}>✏️</button>
            <button className="btn-danger" onClick={() => deleteTask(t.id)}>
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}