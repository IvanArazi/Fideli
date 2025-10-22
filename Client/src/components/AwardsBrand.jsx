import { useEffect, useState } from "react";
import "../styles/components/AwardsBrand.css";

export default function AwardsBrand() {
  const [awards, setAwards] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", requiredPoints: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const brandId = localStorage.getItem("brandId");
  console.log("Brand ID:", brandId);

  useEffect(() => {
    fetch(`${API_URL}/api/awards/brand/${brandId}`)
      .then(res => res.json())
      .then(data => setAwards(Array.isArray(data) ? data : []))
      .catch(() => setAwards([]));
  }, [brandId, success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("requiredPoints", Number(form.requiredPoints));
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/awards`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      setSuccess("Premio creado correctamente");
      setForm({ name: "", description: "", requiredPoints: "" });
      setImage(null);
    } else {
      const data = await res.json();
      setError(data.msg || "Error al crear el premio");
    }
  };

  return (
    <div className="awardsbrand-container">

        <h2>Agregar nuevo premio</h2>
        <form className="awardsbrand-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="awardsbrand-form-inputs">
          <input
            name="name"
            placeholder="Título"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="requiredPoints"
            type="number"
            placeholder="Puntos requeridos"
            value={form.requiredPoints}
            onChange={handleChange}
            required
          />
        </div>
        <div className="awardsbrand-form-inputs">
          <textarea
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">Agregar premio</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>Premios cargados</h2>
      {awards.length === 0 ? (
        <p>No tienes premios cargados aún.</p>
      ) : (
        <ul className="awardsbrand-list">
          {awards.map(award => (
            <li key={award._id}>
              {award.image && (
                <img
                  src={`http://localhost:3000${award.image}`}
                  alt={award.name}
                />
              )}
              <div className="award-details">
                <b>{award.name}</b>
                <b className="details-points"> <i className="bi bi-coin"></i> {award.requiredPoints}</b>             
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}