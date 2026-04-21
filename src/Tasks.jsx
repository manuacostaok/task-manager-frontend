import { useEffect, useState } from "react";

export default function Tasks({ token, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${apiUrl}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setTasks(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [apiUrl, token]);

  const createTask = async () => {
    if (!title.trim()) return;

    const res = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const newTask = await res.json();
    if (!res.ok) return;

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    showToast("Tarea agregada ✔");
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${apiUrl}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    setTasks((prev) => prev.filter((t) => t._id !== id));
    showToast("Tarea eliminada 🗑");
  };

  const editTask = async (id, currentTitle) => {
    const newTitle = prompt("Editar tarea:", currentTitle);
    if (!newTitle) return;

    const res = await fetch(`${apiUrl}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    const updated = await res.json();
    if (!res.ok) return;

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );

    showToast("Tarea actualizada ✏");
  };

  return (
    <div>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      {/* INPUT */}
      <div className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
        />

        <button className="btn-primary" onClick={createTask}>
          + Agregar
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <>
          <div className="skeleton" />
          <div className="skeleton" />
        </>
      )}

      {/* EMPTY */}
      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          No hay tareas todavía 📝
        </div>
      )}

      {/* TASKS */}
      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <span>{task.title}</span>

          <div className="task-actions">

            <button
              className="icon-btn-small icon-edit"
              onClick={() => editTask(task._id, task.title)}
            >
              ✏ 
            </button>

            <button
              className="icon-btn-small icon-delete"
              onClick={() => deleteTask(task._id)}
            >
              🗑
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}