import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/components/Awards.css";

export default function Awards() {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState("");

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
    fetch(`http://localhost:3000/api/redemptions/user/${userId}`)
      .then(res => res.json())
      .then(data => {
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
  }, []);

  return (
    <div className="awards-container">
      <h2 className="awards-title">¡Tus premios están esperando para ser canjeados!</h2>
      {loading ? (
        <p className="awards-loading">Cargando...</p>
      ) : msg ? (
        <p className="awards-msg">{msg}</p>
      ) : redemptions.length === 0 ? (
        <p className="awards-msg">No tenés premios canjeados aún.</p>
      ) : (
        <div className="awards-list">
          {redemptions.map(redem => (
            <div
              className="awards-item"
              key={redem._id}
              onClick={() => setSelected(redem)}
            >
              <div className="awards-item-main">
                <span className="awards-item-award">{redem.awardId?.name}</span>
                <span className="awards-item-brand">{redem.brandId?.name}</span>
              </div>
              <span className="awards-item-code-label">Ver código</span>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="awards-popup-bg" onClick={() => setSelected(null)}>
          <div className="awards-popup" onClick={e => e.stopPropagation()}>
            <h3 className="awards-popup-title">{selected.awardId?.name}</h3>
            <div className="awards-popup-code">{selected.code}</div>
            <p className="awards-popup-msg">
              Mostrá el código en el local para recibir tu premio.
            </p>
            <button className="awards-popup-close" onClick={() => setSelected(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}