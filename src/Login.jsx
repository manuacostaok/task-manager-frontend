import { useState } from "react";

export default function Login({ apiUrl, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "login" : "register";

      const bodyData =
        mode === "login"
          ? { email, password }
          : {
              name: name || email.split("@")[0],
              email,
              password,
            };

      const res = await fetch(`${apiUrl}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.message || "Error en autenticación");
        setLoading(false);
        return;
      }

      if (!data.token) {
        alert("No se recibió token del servidor");
        setLoading(false);
        return;
      }

      onAuth(data.token);
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="login">
        
    

      {/* REGISTER NAME */}
      {mode === "register" && (
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* MAIN BUTTON */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? "Cargando..."
          : mode === "login"
          ? "Login"
          : "Register"}
      </button>

      {/* SWITCH MODE */}
      <button
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          marginTop: 10,
          color: "inherit",
          fontSize: 13,
          opacity: 0.8,
        }}
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
      >
        {mode === "login"
          ? "No tenés cuenta? Registrate"
          : "Ya tenés cuenta? Login"}
      </button>
    </div>
  );
}