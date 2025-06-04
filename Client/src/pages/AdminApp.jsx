import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandsAdmin from "../components/BrandsAdmin";
import UsersAdmin from "../components/UsersAdmin";
import AnalyticsAdmin from "../components/AnalyticsAdmin";
import CategoriesAdmin from "../components/CategoriesAdmin";
import Header from "../components/Header";
import "../styles/AdminApp.css";

export default function AdminApp() {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    };

    const opciones = [
      { nombre: "Comercios", valor: "brands", icono: "bi-shop" },
      { nombre: "Usuarios", valor: "users", icono: "bi-people" },
      { nombre: "Analíticas", valor: "analytics", icono: "bi-bar-chart" },
      { nombre: "Categorías", valor: "categories", icono: "bi-tags" },
    ];

    const [selected, setSelected] = useState("brands");

    const handleSelect = (valor) => {
      setSelected(valor);
    };

    const renderContent = () => {
       switch (selected) {
        case "brands":
          return <BrandsAdmin />;
        case "users":
          return <UsersAdmin />;
        case "analytics":
          return <AnalyticsAdmin />;
        case "categories":
          return <CategoriesAdmin />;
        default:
          return null;
        }
      };

  return (
    <div className="admin-app">
      <Header opciones={opciones} onSelect={handleSelect} />
      <div className="main-content">
        <nav className="admin-nav">
          <p>Hola Admin! 👋</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}