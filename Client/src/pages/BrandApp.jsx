import { useNavigate } from "react-router-dom";

export default function BrandApp() {

  const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/brand/login");
    };

  return(
    <div>
      <h1>Hola!</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}