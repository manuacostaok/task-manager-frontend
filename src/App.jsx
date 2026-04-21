import { useEffect, useState } from "react";
import Login from "./Login";
import Tasks from "./Tasks";
import "./styles.css";

const API_URL = "http://localhost:3000/api";

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
        <h1>Task Manager 🚀</h1>

        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          style={{ width: "100%", marginBottom: 10 }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
        </button>

        {!token ? (
          <Login apiUrl={API_URL} onAuth={handleAuth} />
        ) : (
          <>
            <button className="btn-danger logout" onClick={logout}>
              Logout
            </button>

            <Tasks token={token} apiUrl={API_URL} />
          </>
        )}
      </div>
      <footer className="footer">
  Built by Manu Acosta • 2026
</footer>
    </>
  );
  

}