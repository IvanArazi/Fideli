import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/UserRegister.css";

export default function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      setError("Completá todos los campos");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    const body = {
      name: form.name,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    };
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/login");
    } else {
      setError(data.msg || "Error en el registro");
    }
  };

  return (
    <div className="user-register-container">
      <form className="user-register-form" onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <img src={logo} alt="Fideli Logo" style={{ width: "90px", height: "auto" }} />
        </div>
        <h2>Registrarse</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
        <input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit">Registrarse</button>
        {error && <p className="error-message">{error}</p>}
        <div className="login-link">
          <span>¿Ya tienes cuenta? </span>
          <a type="button" onClick={() => navigate("/login")}>
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
}