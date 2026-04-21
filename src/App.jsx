import { useEffect, useState } from "react";
import Login from "./Login";
import Tasks from "./Tasks";
import { Moon, Sun, LogOut } from "lucide-react";
import "./styles.css";

const API_URL = "https://task-manager-api-lpfs.onrender.com/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleAuth = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      <div className="background-glow glow1" />
      <div className="background-glow glow2" />

      <div className="container">

        {/* HEADER */}
        <div className="app-header">
          <h1> 🗂️ Task Manager 🚀 </h1>

          <div className="header-actions">

            {/* THEME BUTTON */}
            <button
              className="icon-btn"
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
              title="Cambiar tema"
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>

            {/* LOGOUT */}
            {token && (
              <button
                className="icon-btn logout-btn"
                onClick={logout}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
                <span className="logout-text">Logout</span>
              </button>
            )}

          </div>
        </div>

        {!token ? (
          <Login apiUrl={API_URL} onAuth={handleAuth} />
        ) : (
          <Tasks token={token} apiUrl={API_URL} />
        )}
      </div>

      <footer className="footer">
        Built by Manu Acosta • 2026
      </footer>
    </>
  );
}