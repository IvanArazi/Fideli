import { useEffect, useState } from "react";
import "../styles/components/BrandsAdmin.css";
import { Link } from "react-router-dom";

export default function BrandsAdmin() {
  const [activeTab, setActiveTab] = useState("pending");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBrands(activeTab);
  }, [activeTab]);

  const fetchBrands = async (tab) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/brands/${tab}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setBrands(data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error al cargar comercios:", error);
      setBrands([]);
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/brand/${action}/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        fetchBrands(activeTab);
      } else {
        alert(data.msg || "Error en la acción");
      }
    } catch (err) {
      console.error("Error al realizar la acción:", err);
    }
  };

  return (
    <div className="admin-container">
      <div className="tabs">
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
          Pendientes
        </button>
        <button className={activeTab === "approved" ? "active" : ""} onClick={() => setActiveTab("approved")}>
          Aprobados
        </button>
        <button className={activeTab === "rejected" ? "active" : ""} onClick={() => setActiveTab("rejected")}>
          Rechazados
        </button>
      </div>

      {loading ? (
        <p>Cargando comercios...</p>
      ) : brands.length > 0 ? (
        <div className="brand-list">
            {brands.map((brand) => (
              <Link
                to={`/user/brand/${brand._id}`}
                key={brand._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="brand-card">
                  <img src={brand.profileImage ? `${API_URL}${brand.profileImage}` : "/default-logo.png"} alt={brand.name} />
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    {brand.category.map(cat => (<p key={cat._id}>{cat.name}</p>))}
                  </div>
                  {activeTab === "pending" && (
                    <div className="brand-actions">
                      <button className="approve" onClick={e => {e.preventDefault(); handleAction(brand._id, "approved");}}>APROBAR</button>
                      <button className="reject" onClick={e => {e.preventDefault(); handleAction(brand._id, "rejected");}}>RECHAZAR</button>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
      ) : (
        <p>No hay comercios en esta pestaña.</p>
      )}
    </div>
  );
}
