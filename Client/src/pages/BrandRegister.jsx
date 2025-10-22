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
    profileImage: null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setError("Error al cargar categorías"));
  }, []);

  const handleChange = e => {
    if (e.target.name === "profileImage") {
      const file = e.target.files[0];
      if (
        file &&
        !["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      ) {
        setError("Solo se permiten imágenes JPG o PNG");
        return;
      }
      setForm({ ...form, profileImage: file });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

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
  if (!form.manager || !form.phone || !form.description || !form.address || !form.category || !form.profileImage) {
    setError("Completá todos los campos y adjuntá una imagen");
    return;
  }

  const body = new FormData();
    body.append("name", form.name);
    body.append("email", form.email);
    body.append("password", form.password);
    body.append("manager", form.manager);
    body.append("phone", form.phone);
    body.append("description", form.description);
    body.append("address", form.address);
    body.append("category", form.category);
    body.append("profileImage", form.profileImage);

    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/brands`, {
      method: "POST",
      body,
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
            <label htmlFor="">Adjuntar imagen de perfil</label>
            <input
              type="file"
              name="profileImage"
              accept=".jpg,.jpeg,.png"
              onChange={e => setForm({ ...form, profileImage: e.target.files[0] })}
              required
            />

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