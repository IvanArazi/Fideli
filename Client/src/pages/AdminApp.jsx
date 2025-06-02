import { useNavigate } from "react-router-dom";

export default function AdminApp() {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    };

  return (
    <div>
      <h1>Hola Admin!</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}