import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tasks({ token, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState(
    localStorage.getItem("filter") || "all"
  );

  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔔 TOAST
  const showToast = (msg, type = "default") => {
    const id = Date.now();

    setToast({ id, msg, type });

    setTimeout(() => {
      setToast((t) => (t?.id === id ? null : t));
    }, 2500);
  };

  // 🔐 AUTH ERROR
  const handleAuthError = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  // 📥 GET TASKS
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
          showToast("Error al cargar tareas ❌", "error");
          return;
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch {
        showToast("Error de conexión ❌", "error");
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [apiUrl, token]);

  // 💾 GUARDAR FILTRO
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  // ✅ TOGGLE
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
        showToast("Error al actualizar ❌", "error");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch {
      showToast("Error de conexión ❌", "error");
    }
  };

  // ✅ CREATE
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
        showToast("Error al crear ❌", "error");
        return;
      }

      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      showToast("Tarea agregada ✔", "success");
    } catch {
      showToast("Error de conexión ❌", "error");
    }
  };

  // 🗑 DELETE
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/tasks/${deleteModal}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleAuthError(res);

      if (!res.ok) {
        showToast("Error al eliminar ❌", "error");
        setDeleteModal(null);
        return;
      }

      setTasks((prev) =>
        prev.filter((t) => t._id !== deleteModal)
      );

      setDeleteModal(null);
      showToast("Tarea eliminada 🗑", "success");
    } catch {
      showToast("Error de conexión ❌", "error");
      setDeleteModal(null);
    }
  };

  // ✏ EDIT
  const confirmEdit = async () => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/api/tasks/${editModal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editText }),
      });

      handleAuthError(res);

      const updated = await res.json();

      if (!res.ok) {
        showToast("Error al editar ❌", "error");
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === editModal ? updated : t))
      );

      setEditModal(null);
      showToast("Tarea actualizada ✏", "success");
    } catch {
      showToast("Error de conexión ❌", "error");
    }
  };

  // 🔎 FILTRO
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div>
      {/* 🔔 TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className={`toast ${toast.type}`}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <div className="toast-content">
              <span className="toast-icon">
                {toast.type === "success" && "✔"}
                {toast.type === "error" && "✖"}
                {toast.type === "warning" && "⚠"}
                {toast.type === "default" && "🔔"}
              </span>

              <span>{toast.msg}</span>
            </div>

            <div className="toast-progress" />
          </motion.div>
        )}
      </AnimatePresence>

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
      <motion.div
        className="row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
          placeholder="Nueva tarea..."
        />

        <button className="btn-primary" onClick={createTask}>
          + Agregar
        </button>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <>
          <div className="skeleton" />
          <div className="skeleton" />
        </>
      )}

      {/* EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state">No hay tareas 📝</div>
      )}

      {/* TASKS */}
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task._id}
            className={`task ${task.completed ? "done" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            layout
          >
            <span>{task.title}</span>

            <div className="task-actions">
              <button
                className="check-btn"
                onClick={() =>
                  toggleTask(task._id, task.completed)
                }
              >
                {task.completed ? "✅" : "⬜"}
              </button>

              <button
                className="icon-btn-small icon-edit"
                onClick={() => {
                  setEditModal(task._id);
                  setEditText(task.title);
                }}
              >
                ✏
              </button>

              <button
                className="icon-btn-small icon-delete"
                onClick={() => setDeleteModal(task._id)}
              >
                🗑
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ✏ MODAL EDIT */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setEditModal(null)}
          >
            <motion.div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Editar tarea</h3>

              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && confirmEdit()
                }
              />

              <div className="modal-actions">
                <button onClick={() => setEditModal(null)}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={confirmEdit}>
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑 MODAL DELETE */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>¿Eliminar tarea?</h3>

              <div className="modal-actions">
                <button onClick={() => setDeleteModal(null)}>
                  Cancelar
                </button>
                <button className="btn-danger" onClick={confirmDelete}>
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}