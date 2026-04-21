import { useEffect, useState } from "react";

export default function Tasks({ token, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState(
    localStorage.getItem("filter") || "all"
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // 🔐 helper para manejar token expirado
  const handleAuthError = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${apiUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        handleAuthError(res);

        const data = await res.json();

        if (!res.ok) {
          showToast("Error al cargar tareas ❌");
          return;
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch {
        showToast("Error de conexión ❌");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [apiUrl, token]);

  // 💾 guardar filtro
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // ✅ TOGGLE COMPLETED
  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      handleAuthError(res);

      const updated = await res.json();

      if (!res.ok) {
        showToast("Error al actualizar ❌");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch {
      showToast("Error de conexión ❌");
    }
  };

  // ✅ CREAR
  const createTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      handleAuthError(res);

      const newTask = await res.json();

      if (!res.ok) {
        showToast("Error al crear ❌");
        return;
      }

      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      showToast("Tarea agregada ✔");
    } catch {
      showToast("Error de conexión ❌");
    }
  };

  // ✅ DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("¿Eliminar tarea?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleAuthError(res);

      if (!res.ok) {
        showToast("Error al eliminar ❌");
        return;
      }

      setTasks((prev) => prev.filter((t) => t._id !== id));
      showToast("Tarea eliminada 🗑");
    } catch {
      showToast("Error de conexión ❌");
    }
  };

  // ✅ EDIT
  const editTask = async (id, currentTitle) => {
    const newTitle = prompt("Editar tarea:", currentTitle);
    if (!newTitle?.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      handleAuthError(res);

      const updated = await res.json();

      if (!res.ok) {
        showToast("Error al editar ❌");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );

      showToast("Tarea actualizada ✏");
    } catch {
      showToast("Error de conexión ❌");
    }
  };

  // ✅ FILTRO
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div>
      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}

      {/* FILTRO */}
      <div className="filter-row">
        <span style={{ fontSize: "13px", opacity: 0.7 }}>
          {filteredTasks.length} tareas
        </span>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>

      {/* INPUT */}
      <div className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && createTask()
          }
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
      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state">
          No hay tareas 📝
        </div>
      )}

      {/* TASKS */}
      {filteredTasks.map((task) => (
        <div
          className={`task ${task.completed ? "done" : ""}`}
          key={task._id}
        >
          <span>{task.title}</span>

          <div className="task-actions">
            {/* COMPLETAR */}
            <button
              className="check-btn"
              onClick={() =>
                toggleTask(task._id, task.completed)
              }
            >
              {task.completed ? "✅" : "⬜"}
            </button>

            {/* EDIT */}
            <button
              className="icon-btn-small icon-edit"
              onClick={() =>
                editTask(task._id, task.title)
              }
            >
              ✏
            </button>

            {/* DELETE */}
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