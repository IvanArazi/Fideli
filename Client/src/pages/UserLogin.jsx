import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/UserRegister.css";

export default function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:3000/api/users/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      login(data.token); // <-- usa el contexto
      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      const role = decoded.role;
      if (role === "admin") navigate("/admin/app");
      else navigate("/user/app");
    } else {
      setError(data.msg || "Error en el login");
    }
  };

  return (
    <div className="user-register-container">
      <form className="user-register-form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <img src={logo} alt="Fideli Logo" style={{ width: "90px", height: "auto" }} />
        </div>
        <h2>Iniciar sesión</h2>
        <input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <button type="submit">Iniciar sesión</button>
        {error && <p className="error-message">{error}</p>}
        <div className="login-link">
          <span>¿No tienes cuenta? </span>
          <a type="button" onClick={() => navigate("/register")}>
            Regístrate aquí
          </a>
        </div>
      </form>
    </div>
  );
}