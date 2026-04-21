const API_URL = "http://localhost:3000/api";

// LOGIN
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

// GET TASKS
export const getTasks = async (token) => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// CREATE TASK
export const createTask = async (title, token) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  return res.json();
};

// DELETE TASK
export const deleteTask = async (id, token) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};

// UPDATE TASK
export const updateTask = async (id, title, token) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title })
  });

  return res.json();
};