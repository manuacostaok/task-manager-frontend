import { useEffect, useState } from "react";
import Login from "./Login";
import Tasks from "./Tasks";
import "./styles.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <div className="background-glow glow1" />
      <div className="background-glow glow2" />

      <div className="container">
        <h1>Task Manager 🚀</h1>

        {/* DARK MODE TOGGLE */}
        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          style={{ width: "100%", marginBottom: 10 }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀ Light Mode"}
        </button>

        {token ? (
          <>
            <button className="btn-danger logout" onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}>
              Logout
            </button>

            <Tasks token={token} />
          </>
        ) : (
          <Login onLogin={(t) => {
            localStorage.setItem("token", t);
            setToken(t);
          }} />
        )}
      </div>
    </>
  );
}