import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/components/Brands.css";

export default function Brands({ initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  // Si viene con filtro de categoría desde Home
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catId = params.get("category");
    if (catId) setSelectedCategory(catId);
  }, [location.search]);

  // Traer categorías
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Traer comercios aprobados (o filtrados por categoría)
  useEffect(() => {
    setLoading(true);
    setError("");
    let url = `${API_URL}/api/brands/approved`;
    if (selectedCategory) url = `${API_URL}/api/brands/categoryId/${selectedCategory}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setBrands(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar comercios");
        setLoading(false);
      });
  }, [selectedCategory]);

  // Filtrar por nombre
  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
  };

  return (
    <div className="brands2-container">
      <h2>Comercios</h2>
      <div className="brands-filters">
        <input
          type="text"
          placeholder="Buscar comercio..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="brands-search"
        />
        <div className="brands2-categories">
          <button
            className={!selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory(null)}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={selectedCategory === cat._id ? "active" : ""}
              onClick={() => handleCategoryClick(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p>Cargando comercios...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredBrands.length === 0 ? (
        <p>No se encontraron comercios.</p>
      ) : (
        <div className="brands2-list">
          {filteredBrands.map(brand => (
            <div className="brands2-item" key={brand._id}>
              <img
                src={brand.profileImage ? `${API_URL}${brand.profileImage}` : "/default-brand.png"}
                alt={brand.name}
                className="brands2-img"
              />
              <div>
                <h3>{brand.name}</h3>
                <p className="category-description">{brand.category.map(cat => (<span key={cat._id}>{cat.name}</span>))}</p>
                <span className="category-description">
                  {brand.category.map(catId => {
                    const cat = categories.find(c => c._id === catId);
                    return cat ? cat.name : "";
                  }).join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}