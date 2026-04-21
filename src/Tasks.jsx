import { useEffect, useState } from "react";

export default function Tasks({ token, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // GET
  useEffect(() => {
    const getTasks = async () => {
      const res = await fetch(`${apiUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    };

    getTasks();
  }, [apiUrl, token]);

  // CREATE
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
  };

  // DELETE (FIX ESTABLE)
  const deleteTask = async (id) => {
    const res = await fetch(`${apiUrl}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // EDIT (FIX REAL TIME UPDATE)
  const editTask = async (id, newTitle) => {
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
  };

  return (
    <div>
      <div className="row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
        />

        <button className="btn-primary" onClick={createTask}>
          Agregar
        </button>
      </div>

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <span>{task.title}</span>

          <div className="row">
            <button
              className="btn-primary"
              onClick={() => {
                const newTitle = prompt(
                  "Editar tarea:",
                  task.title
                );
                if (newTitle) editTask(task._id, newTitle);
              }}
            >
              Edit
            </button>

            <button
              className="btn-danger"
              onClick={() => deleteTask(task._id)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}