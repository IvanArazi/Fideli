import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BrandRegister.css";
import logo from "../assets/logo.png";

export default function BrandRegisterWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    manager: "",
    phone: "",
    description: "",
    address: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setError("Error al cargar categorías"));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.password || !form.confirmPassword)) {
      setError("Completá todos los campos");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setStep(2);
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.manager || !form.phone || !form.description || !form.address || !form.category) {
      setError("Completá todos los campos");
      return;
    }

    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      manager: form.manager,
      phone: form.phone,
      description: form.description,
      address: form.address,
      category: [form.category],
    };

    const res = await fetch("http://localhost:3000/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      navigate("/brand/login");
    } else {
      setError(data.msg || "Error en el registro");
    }
  };

  return (
    <div className="brand-register-container">
      <form className="brand-register-form" onSubmit={handleSubmit}>
      <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="Fideli Logo" style={{ width: "90px", height: "auto" }} />
      </div>
        <h2>{step === 1 ? "Crear cuenta" : "Configurá tu comercio"}</h2>
        <p>Creá tu cuenta para usar Fideli en tu comercio</p>

        {step === 1 && (
          <>
            <input name="name" placeholder="Nombre del comercio" value={form.name} onChange={handleChange} required />
            <input name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} required />
            <button type="button" onClick={nextStep}>Siguiente</button>
            <div className="login-link">
              <span>¿Ya tienes cuenta? </span>
              <a type="button" onClick={() => navigate("/brand/login")}>
                Iniciar sesión
              </a>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Seleccioná una categoría</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <input name="manager" placeholder="Nombre del dueño" value={form.manager} onChange={handleChange} required />
            <input name="address" placeholder="Ubicación" value={form.address} onChange={handleChange} required />
            <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required />
            <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />

            <div className="step-buttons">
              <button className="back-button" type="button" onClick={prevStep}>Anterior</button>
              <button type="submit">Crear cuenta</button>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}