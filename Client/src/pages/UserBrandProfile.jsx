import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/UserBrandProfile.css";
import { Link } from "react-router-dom";

export default function UserBrandProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [awards, setAwards] = useState([]);
  const [error, setError] = useState("");
  const [points, setPoints] = useState(0);
  const [activeTab, setActiveTab] = useState("premios");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const userId = localStorage.getItem("userId");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/brands/${id}`)
      .then(res => res.json())
      .then(data => setBrand(data))
      .catch(() => setError("Error al cargar el comercio"));
  }, [id]);

  useEffect(() => {
    fetch(`${API_URL}/api/events/brand/${id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, [id]);

  useEffect(() => {
    fetch(`${API_URL}/api/awards/brand/${id}`)
      .then(res => res.json())
      .then(data => setAwards(Array.isArray(data) ? data : []))
      .catch(() => setAwards([]));
  }, [id]);

  useEffect(() => {
    fetch(`${API_URL}/api/events/brand/${id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
  }, [id]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_URL}/api/points/user/${userId}/brand/${id}`)
      .then(res => res.json())
      .then(data => {
        setPoints(Array.isArray(data) && data[0]?.points ? data[0].points : 0);
      })
      .catch(() => setPoints(0));
  }, [userId, id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!brand) return <p>Cargando...</p>;

  return (
    <div className="userbrandprofile-container">
      <button
        onClick={() => navigate(-1)}
        className="userbrandprofile-back"
        title="Volver"
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      <div className="userbrandprofile-header">
        <div className="userbrandprofile-info-container">
          <img
            src={brand.profileImage ? `${API_URL}${brand.profileImage}` : "/default-profile.png"}
            alt={brand.name}
            className="userbrandprofile-img"
          />
          <div className="userbrandprofile-info">
            <h2 className="userbrandprofile-title">{brand.name}</h2>
            <p className="userbrand-category">{brand.category.map(cat => (<span key={cat._id}>{cat.name}</span>))}</p>
            <p className="userpoints"> <i className="bi bi-coin"></i> {points}</p>
          </div>
        </div>
        <div>
          <i className="bi bi-bookmark"></i>
        </div>
      </div>

      <p>{brand.description}</p>

      <div className="userbrandprofile-tabs">
        <button
          className={activeTab === "premios" ? "active" : ""}
          onClick={() => setActiveTab("premios")}
        >
          Premios
        </button>
        <button
          className={activeTab === "eventos" ? "active" : ""}
          onClick={() => setActiveTab("eventos")}
        >
          Eventos
        </button>
      </div>

      {activeTab === "premios" && (
        <>
          {awards.length === 0 ? (
            <p className="userbrandprofile-noawards">Este comercio no tiene premios cargados aún.</p>
          ) : (
            <div className="userbrandprofile-awards-list">
              {awards.map(award => (
                <Link
                  to={`/user/award/${award._id}`}
                  key={award._id}
                  className="userbrandprofile-award-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                <div className="userbrandprofile-award" key={award._id}>
                  <img
                    src={award.image ? `${API_URL}${award.image}` : "/default-award.png"}
                    alt={award.name}
                    className="userbrandprofile-award-img"
                  />
                  <div>
                    <div className="userbrandprofile-award-name">{award.name}</div>
                    <div className="userbrandprofile-award-points">
                      <i className="bi bi-coin"></i> {award.requiredPoints}
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "eventos" && (
        events.length === 0 ? (
          <div className="userbrandprofile-events-empty">
            <p>Este comercio no tiene eventos cargados aún.</p>
          </div>
        ) : (
          <div className="userbrandprofile-events-list">
            {events.map(ev => (
              <button key={ev._id} className="userbrandprofile-event" onClick={() => setSelectedEvent(ev)}>
                <div className="ube-title">{ev.title}</div>
                <div className="ube-meta">
                  <span>{new Date(ev.startDate).toLocaleDateString()} - {new Date(ev.endDate).toLocaleDateString()}</span>
                  <span> - {ev.hours}</span>
                </div>
                <div className="ube-location"><i className="bi bi-geo-alt"></i> {ev.location}</div>
                <p className="ube-desc">{ev.description}</p>
              </button>
            ))}
          </div>
        )
      )}
      {selectedEvent && (
        <div className="ube-modal-bg" onClick={() => setSelectedEvent(null)}>
          <div className="ube-modal" onClick={e => e.stopPropagation()}>
            <button className="ube-close" aria-label="Cerrar" onClick={() => setSelectedEvent(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <h3 className="ube-modal-title">{selectedEvent.title}</h3>
            <div className="ube-modal-meta">
              <span>{new Date(selectedEvent.startDate).toLocaleString()} - {new Date(selectedEvent.endDate).toLocaleString()}</span>
              <span> - {selectedEvent.hours}</span>
              <span className="ube-location"><i className="bi bi-geo-alt"></i> {selectedEvent.location}</span>
            </div>
            <p className="ube-modal-desc">{selectedEvent.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

