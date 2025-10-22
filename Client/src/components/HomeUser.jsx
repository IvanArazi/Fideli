import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/HomeUser.css";
import { jwtDecode } from "jwt-decode";

export default function HomeUser({ onCategoryClick }) {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [uniqueNumber, setUniqueNumber] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/brands/approved`)
            .then(res => res.json())
            .then(data => setBrands(data))
            .catch(() => setError("Error al cargar los comercios"));
    }, []);

    useEffect(() => {
      fetch(`${API_URL}/api/categories`)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(() => setCategories([]));
    }, []);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUniqueNumber(decoded.uniqueNumber);
      }
    }, []);

  return (
    <div className="home-user-container">
      <div className="home-user-header">
        <div className="usernumber"> 
          <p className="usernum">{uniqueNumber}</p>
          <p className="shownum">Mostrá tu código numérico para sumar puntos</p>
        </div>
        <div className="userawards">
          <i className="bi bi-gift">
          </i>
          Tus Premios
        </div>
      </div>
      <div className="home-user-brands">
        <h2>Descubrí los mejores locales gastronómicos</h2>
        <p className="see-all">Ver todos</p>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="brands-list">
        {brands.map(brand => (
          <div
            key={brand._id}
            onClick={() => navigate(`/brand/${brand._id}`)}
          >
            <img
              src={brand.profileImage ? `${API_URL}${brand.profileImage}` : "/default-profile.png"}
              alt={brand.name}
            />
          </div>
        ))}
      </div>
      <div className="home-user-categories">
        <h2>Categorías</h2>
      </div>
      <div className="categories-list">
        {categories.map(cat => (
          <div className="category-card" key={cat._id}>
            <button
               key={cat._id}
              onClick={() => onCategoryClick && onCategoryClick(cat._id)}
            >
              <img
                src={cat.image ? `${API_URL}${cat.image}` : "/default-category.png"}
                alt={cat.name}
              />
            </button>
            <p className="categoryname">{cat.name}</p>
          </div>
        ))}
      </div>
      <div className="home-user-events">
        <div className="explore-awards">¡Explorá los premios que podes ganar!</div>
        <div className="next-events">Próximos eventos</div>
      </div>
    </div>
  );
}