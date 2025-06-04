import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/BrandApp.css";
import Header from "../components/Header";
import HomeBrand from "../components/HomeBrand";
import Analytics from "../components/Analytics";
import AwardsBrand from "../components/AwardsBrand";

export default function BrandApp() {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/brand/login");
    };

    const opciones = [
      { nombre: "Inicio", valor: "inicio", icono: "bi-house" },
      { nombre: "Analíticas", valor: "analiticas", icono: "bi-bar-chart" },
      { nombre: "Mis premios", valor: "premios", icono: "bi-gift" },
    ];

    const [selected, setSelected] = useState("inicio");
  
    // Actualiza el estado cuando seleccionas una opción
    const handleSelect = (valor) => {
      setSelected(valor);
    };
  
    // Renderiza el componente correspondiente
    const renderContent = () => {
      switch (selected) {
        case "inicio":
          return <HomeBrand />;
        case "analiticas":
          return <Analytics />;
        case "premios":
          return <AwardsBrand />;
        // Si tienes un componente para explorar, agrégalo aquí
        default:
          return null;
      }
    };

  return(
    <div className="brand-app">
      <Header opciones={opciones} onSelect={handleSelect} />
      <div className="main-content">
        <nav className="brand-nav">
          <p>Hola! 👋</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}