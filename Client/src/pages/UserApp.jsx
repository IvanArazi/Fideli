import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo.png";

export default function UserApp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

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
        setName(decoded.name); // ✅ usamos "name" desde el token
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

  return (
    <div style={{ backgroundColor:"#ddd", height:"100vh", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center", gap: "2em", marginBottom: "1rem", width: "100%" }}>
      <img src={logo} alt="Fideli Logo" style={{ width: "90px", height: "auto" }} />
      <h1>Hola, {name} 👋</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
