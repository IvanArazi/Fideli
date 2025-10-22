import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import HomeUser from "../components/HomeUser";
import Brands from "../components/Brands";
import Awards from "../components/Awards";
import Explore from "../components/Explore";
import "../styles/UserApp.css";

export default function UserApp() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [selected, setSelected] = useState("inicio");
  const [categoryFilter, setCategoryFilter] = useState(null);


  const opciones = [
    { nombre: "Inicio", valor: "inicio", icono: "bi-house" },
    { nombre: "Comercios", valor: "comercios", icono: "bi-shop" },
    { nombre: "Tus premios", valor: "premios", icono: "bi-gift" },
    { nombre: "Explorar", valor: "explorar", icono: "bi-compass" },
  ];

  const handleSelect = (valor) => {
    setSelected(valor);
  };

  // Función para HomeUser para filtrar por categoría
  const handleCategoryFromHome = (catId) => {
    setCategoryFilter(catId);
    setSelected("comercios");
  };

  const renderContent = () => {
    switch (selected) {
      case "inicio":
        return <HomeUser onCategoryClick={handleCategoryFromHome}/>;
      case "comercios":
        return <Brands initialCategory={categoryFilter}/>;
      case "premios":
        return <Awards />;
      case "explorar":
        return <Explore />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-app">
      <Header opciones={opciones} onSelect={handleSelect} />
      <div className="main-content">
        <nav className="user-nav">
          <p>¡Hola, {user?.name || "Usuario"}!</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}