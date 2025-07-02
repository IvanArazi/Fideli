import { useState } from "react";
import "../styles/components/HomeBrand.css";

export default function HomeBrand() {
  const [showPopup, setShowPopup] = useState(false);
  const [uniqueNumber, setUniqueNumber] = useState("");
  const [price, setPrice] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRedeemPopup, setShowRedeemPopup] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemMsg, setRedeemMsg] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  const handleAcumulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/points/acumulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uniqueNumber,
        price: Number(price),
      }),
    });
    const data = await res.json();
    setLoading(false);
    setMsg(data.msg || "Error al cargar puntos");
    if (res.ok) {
      setUniqueNumber("");
      setPrice("");
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeemLoading(true);
    setRedeemMsg("");
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/redemptions/validation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: redeemCode }),
    });
    const data = await res.json();
    setRedeemLoading(false);
    setRedeemMsg(data.msg || "Error al validar el canje");
    if (res.ok) setRedeemCode("");
  };

  return (
    <div className="homebrand-container">
      <button className="homebrand-btn1" onClick={() => setShowPopup(true)}>
        CARGAR PUNTOS
      </button>
      <p className="button-description">Sumá puntos a un cliente ingresando su código Fideli y el monto de su compra.</p>
      <button
        className="homebrand-btn2"
        onClick={() => setShowRedeemPopup(true)}
      >
        CANJEAR PREMIO
      </button>
      <p className="button-description">Ingresá el código del canje del cliente y entregale el premio correspondiente.</p>

      {/* Popup Cargar Puntos */}
      {showPopup && (
        <div className="homebrand-popup-bg">
          <div className="homebrand-popup">
            <h2>Cargar Puntos</h2>
            <p>Aquí podrás otorgarle puntos a tu cliente por su compra. Deberás ingregar el código numérico del cliente y el monto exacto de la compra que está realizando.</p>
            <form className="homebrand-form" onSubmit={handleAcumulate}>
              <input
                type="text"
                placeholder="Código de usuario"
                value={uniqueNumber}
                onChange={e => setUniqueNumber(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Monto de compra"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                min={0}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Cargando..." : "Cargar puntos"}
              </button>
            </form>
            {msg && <p className="homebrand-msg">{msg}</p>}
            <button
              className="homebrand-close"
              onClick={() => { setShowPopup(false); setMsg(""); }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Popup Canjear Premios */}
      {showRedeemPopup && (
        <div className="homebrand-popup-bg">
          <div className="homebrand-popup">
            <h2>Canjear Premio</h2>
            <form className="homebrand-form" onSubmit={handleRedeem}>
              <input
                type="text"
                placeholder="Código del premio"
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value)}
                required
              />
              <button type="submit" disabled={redeemLoading}>
                {redeemLoading ? "Validando..." : "Validar canje"}
              </button>
            </form>
            {redeemMsg && <p className="homebrand-msg">{redeemMsg}</p>}
            <button
              className="homebrand-close"
              onClick={() => { setShowRedeemPopup(false); setRedeemMsg(""); }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}