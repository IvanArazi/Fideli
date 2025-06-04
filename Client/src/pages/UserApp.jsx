import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import HomeUser from "../components/HomeUser";
import Brands from "../components/Brands";
import Awards from "../components/Awards";
import Explore from "../components/Explore";
import "../styles/UserApp.css";

export default function UserApp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("inicio");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // Token expirado
        localStorage.clear();
        navigate("/login");
      } else {
        setName(decoded.name); // usamos "name" desde el token
      }
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };


  const opciones = [
    { nombre: "Inicio", valor: "inicio", icono: "bi-house" },
    { nombre: "Comercios", valor: "comercios", icono: "bi-shop" },
    { nombre: "Tus premios", valor: "premios", icono: "bi-gift" },
    { nombre: "Explorar", valor: "explorar", icono: "bi-compass" },
  ];

  // Actualiza el estado cuando seleccionas una opción
  const handleSelect = (valor) => {
    setSelected(valor);
  };

  // Renderiza el componente correspondiente
  const renderContent = () => {
    switch (selected) {
      case "inicio":
        return <HomeUser />;
      case "comercios":
        return <Brands />;
      case "premios":
        return <Awards />;
      case "explorar":
        return <Explore />;
      default:
        return null;
    }
  };

  return (
    <div className="user-app">
      <Header opciones={opciones} onSelect={handleSelect} />
      <div className="main-content">
        <nav className="user-nav">
          <p>Hola, {name}! 👋</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}