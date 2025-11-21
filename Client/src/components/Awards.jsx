import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/components/Awards.css";

export default function Awards() {
  const [redemptions, setRedemptions] = useState([]);
  const [histories, setHistories] = useState([]);
  const [activeTab, setActiveTab] = useState("redemptions");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = null;
    if (token) {
      try {
        userId = jwtDecode(token).id;
      } catch {}
    }
    if (!userId) {
      setMsg("No se pudo identificar al usuario.");
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/redemptions/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRedemptions(data);
        } else {
          setMsg(data.message || "No se encontraron canjes.");
        }
        setLoading(false);
      })
      .catch(() => {
        setMsg("Error al cargar los canjes.");
        setLoading(false);
      });

    setLoadingHistory(true);
    fetch(`${API_URL}/api/histories/user/${userId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setHistories(Array.isArray(data) ? data : []))
      .finally(() => setLoadingHistory(false));
  }, []);

  const groupedHistory = (() => {
    const byDate = {};
    const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    for (const h of sorted) {
      const key = new Date(h.createdAt).toLocaleDateString();
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(h);
    }
    return Object.entries(byDate);
  })();

  return (
    <div className="awards-container">
      <h2 className="awards-title">Tus premios estan esperando para ser canjeados!</h2>

      <div className="tabs">
        <button className={activeTab === "redemptions" ? "active" : ""} onClick={() => setActiveTab("redemptions")}>
          Tus canjes
        </button>
        <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>
          Historial
        </button>
      </div>

      {activeTab === "redemptions" && (
        loading ? (
          <p className="awards-loading">Cargando...</p>
        ) : msg ? (
          <p className="awards-msg">{msg}</p>
        ) : redemptions.length === 0 ? (
          <p className="awards-msg">No tenes premios canjeados aun.</p>
        ) : (
          <div className="awards-list">
            {redemptions.map((redem) => (
              <div className="awards-item" key={redem._id} onClick={() => setSelected(redem)}>
                <div className="awards-item-main">
                  <span className="awards-item-award">{redem.awardId?.name}</span>
                  <span className="awards-item-brand">{redem.brandId?.name}</span>
                </div>
                <span className="awards-item-code-label">Ver codigo</span>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "history" && (
        loadingHistory ? (
          <p className="awards-loading">Cargando historial...</p>
        ) : groupedHistory.length === 0 ? (
          <p className="awards-msg">Aun no hay historial.</p>
        ) : (
          <div className="awards-list">
            {groupedHistory.map(([date, items]) => (
              <div key={date} style={{ width: "100%" }}>
                <div className="awards-date-sep">{date}</div>
                {items.map((h) => (
                  <div className="awards-item history" key={h._id}>
                    <div className="awards-item-main">
                      <span className="awards-item-award">{h.awardId?.name || "Premio"}</span>
                      <span className="awards-item-brand">{h.brandId?.name || ""}</span>
                    </div>
                    <span className="awards-item-code-label">{new Date(h.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}

      {selected && (
        <div className="awards-popup-bg" onClick={() => setSelected(null)}>
          <div className="awards-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="awards-popup-title">{selected.awardId?.name}</h3>
            <div className="awards-popup-code">{selected.code}</div>
            <p className="awards-popup-msg">Mostra este codigo en el local para recibir tu premio.</p>
            <button className="awards-popup-close" onClick={() => setSelected(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

