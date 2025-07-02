import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserAward.css";
import { jwtDecode } from "jwt-decode";

export default function UserAward() {
  const { awardId } = useParams();
  const [award, setAward] = useState(null);
  const [brand, setBrand] = useState(null);
  const [userPoints, setUserPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  // Obtener userId del token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      userId = jwtDecode(token).id;
    } catch {}
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setMsg("");
      // Traer info del premio
      const resAward = await fetch(`http://localhost:3000/api/awards/${awardId}`);
      const awardData = await resAward.json();
      setAward(awardData);
      console.log(awardData);
      console.log(awardData.brand._id);

      // Traer info del comercio
      const resBrand = await fetch(`http://localhost:3000/api/brands/${awardData.brand._id}`);
      const brandData = await resBrand.json();
      setBrand(brandData);

      // Traer puntos del usuario en ese comercio
      if (userId) {
        const resPoints = await fetch(`http://localhost:3000/api/points/user/${userId}/brand/${awardData.brand._id}`);
        if (resPoints.ok) {
        const pointsData = await resPoints.json();
        setUserPoints(Array.isArray(pointsData) && pointsData[0]?.points ? pointsData[0].points : 0);
        } else {
        setUserPoints(0);
        }
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [awardId]);

  const handleRedeem = async () => {
    setRedeeming(true);
    setMsg("");
    const res = await fetch("http://localhost:3000/api/redemptions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ awardId }),
    });
    const data = await res.json();
    setRedeeming(false);
    setMsg(data.msg || "Error al canjear");
    if (res.ok) {
      // Actualizar puntos
      setUserPoints(userPoints - award.requiredPoints);
    }
  };

  if (loading || !award || !brand) return <div className="useraward-loading">Cargando...</div>;

  const canRedeem = userPoints >= award.requiredPoints;
  const pointsNeeded = award.requiredPoints - userPoints;

  return (
    <div className="useraward-container">
      <div className="useraward-card">
        <div className="useraward-header">
          <img className="useraward-img" src={`http://localhost:3000${award.image}`} alt={award.name} />
          <div>
            <h2 className="useraward-title">{award.name}</h2>
            <h3 className="useraward-brand">{brand.name}</h3>
          </div>
        </div>
        <div className="useraward-points">
          <span className="useraward-label">Tus puntos</span>
          <span className="useraward-userpoints">{userPoints}</span>
        </div>
        <div className="useraward-required">
          <span className="useraward-label">Costo</span>
          <span className="useraward-requiredpoints">{award.requiredPoints}</span>
        </div>
        <button
          className="useraward-redeem"
          onClick={handleRedeem}
          disabled={!canRedeem || redeeming}
        >
          {canRedeem
            ? (redeeming ? "Canjeando..." : "Canjear")
            : `Te faltan ${pointsNeeded} puntos`}
        </button>
        {msg && <div className="useraward-msg">{msg}</div>}
      </div>
    </div>
  );
}