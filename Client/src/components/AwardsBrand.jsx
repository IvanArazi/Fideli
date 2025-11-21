import { useEffect, useState } from "react";
import "../styles/components/AwardsBrand.css";
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function AwardsBrand() {
  const [awards, setAwards] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", requiredPoints: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ title:'', description:'', location:'', hours:'', startDate:'', endDate:'' });
  const [editingEventId, setEditingEventId] = useState(null);
  const [activeTab, setActiveTab] = useState('awards');
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const API_URL = import.meta.env.VITE_API_URL;

  const brandId = localStorage.getItem("brandId");
  console.log("Brand ID:", brandId);

  useEffect(() => {
    fetch(`${API_URL}/api/awards/brand/${brandId}`)
      .then(res => res.json())
      .then(data => setAwards(Array.isArray(data) ? data : []))
      .catch(() => setAwards([]));
  }, [brandId, success]);
  useEffect(() => {
    fetch(`${API_URL}/api/events/brand/${brandId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]));
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
      setSuccess("");
      setToast({ show: true, type: 'success', message: 'Premio creado correctamente' });
      setForm({ name: "", description: "", requiredPoints: "" });
      setImage(null);
    } else {
      const data = await res.json();
      setError("");
      setToast({ show: true, type: 'error', message: (data && data.msg) || 'Error al crear el premio' });
    }
  };

  const deleteAward = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Eliminar este premio?')) return;
    const r = await fetch(`${API_URL}/api/awards/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    if (r.ok) {
      setAwards(prev => prev.filter(a => a._id !== id));
      setSuccess('');
      setToast({ show: true, type: 'success', message: 'Premio eliminado' });
    } else {
      setError('');
      setToast({ show: true, type: 'error', message: 'No se pudo eliminar el premio' });
    }
  };

  const handleEventChange = e => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const submitEvent = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const token = localStorage.getItem('token');
    const method = editingEventId ? 'PUT' : 'POST';
    const url = editingEventId ? `${API_URL}/api/events/${editingEventId}` : `${API_URL}/api/events`;
    const r = await fetch(url, { method, headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(eventForm) });
    if (r.ok) {
      setSuccess('');
      setToast({ show: true, type: 'success', message: editingEventId ? 'Evento actualizado' : 'Evento creado' });
      setEventForm({ title:'', description:'', location:'', hours:'', startDate:'', endDate:'' });
      setEditingEventId(null);
      const res = await fetch(`${API_URL}/api/events/brand/${brandId}`);
      const data = res.ok ? await res.json() : [];
      setEvents(Array.isArray(data)?data:[]);
    } else {
      setError('');
      setToast({ show: true, type: 'error', message: 'No se pudo guardar el evento' });
    }
  };

  const editEvent = (ev) => {
    setEditingEventId(ev._id);
    setEventForm({
      title: ev.title || '',
      description: ev.description || '',
      location: ev.location || '',
      hours: ev.hours || '',
      startDate: ev.startDate ? ev.startDate.slice(0,10) : '',
      endDate: ev.endDate ? ev.endDate.slice(0,10) : '',
    });
  };

  const deleteEventById = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('¿Eliminar este evento?')) return;
    const r = await fetch(`${API_URL}/api/events/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
    if (r.ok) {
      setEvents(prev => prev.filter(e => e._id !== id));
      setSuccess(''); setToast({ show: true, type: 'success', message: 'Evento eliminado' });
    } else {
      setError(''); setToast({ show: true, type: 'error', message: 'No se pudo eliminar el evento' });
    }
  };

  return (
    <div className="awardsbrand-container">
        <div className="tabs">
          <button type="button" className={activeTab==='awards' ? 'active' : ''} onClick={() => setActiveTab('awards')}>Premios</button>
          <button type="button" className={activeTab==='events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Eventos</button>
        </div>

      <div className={activeTab==='awards' ? '' : 'hidden'}>
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
      </form>

      <h2>Premios cargados</h2>
      {awards.length === 0 ? (
        <p>No tienes premios cargados aún.</p>
      ) : (
        <ul className="awardsbrand-list">
          {awards.map(award => (
            <li key={award._id}>
              {award.image && (
                <img src={`${API_URL}${award.image}`} alt={award.name} />
              )}
              <div className="award-details">
                <b>{award.name}</b>
                <b className="details-points"> <i className="bi bi-coin"></i> {award.requiredPoints}</b>
              </div>
              <button className="inline-danger" onClick={() => deleteAward(award._id)} aria-label="Eliminar premio">
                <i className="bi bi-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      )}

      </div>

      <div className={activeTab==='events' ? '' : 'hidden'}>
      <h2>Eventos</h2>
      <form className="awardsbrand-form" onSubmit={submitEvent}>
        <div className="awardsbrand-form-inputs">
          <input name="title" placeholder="Título" value={eventForm.title} onChange={handleEventChange} required />
          <input name="location" placeholder="Ubicación" value={eventForm.location} onChange={handleEventChange} required />
        </div>
        <div className="awardsbrand-form-inputs">
          <input name="hours" placeholder="Horario" value={eventForm.hours} onChange={handleEventChange} required />
          <input type="date" name="startDate" value={eventForm.startDate} onChange={handleEventChange} required />
          <input type="date" name="endDate" value={eventForm.endDate} onChange={handleEventChange} required />
        </div>
        <div className="awardsbrand-form-inputs">
          <textarea name="description" placeholder="Descripción" value={eventForm.description} onChange={handleEventChange} required />
        </div>
        <button type="submit">{editingEventId ? 'Actualizar evento' : 'Crear evento'}</button>
      </form>

      <h3>Eventos cargados</h3>
      {events.length === 0 ? (
        <p>No tienes eventos cargados aún.</p>
      ) : (
        <ul className="awardsbrand-list">
          {events.map(ev => (
            <li key={ev._id}>
              <div className="award-details">
                <b>{ev.title}</b>
                <span>{ev.location} • {ev.hours}</span>
                <span>{new Date(ev.startDate).toLocaleDateString()} - {new Date(ev.endDate).toLocaleDateString()}</span>
              </div>
              <div style={{marginLeft:'auto', display:'flex', gap:'.5rem'}}>
                <button className="inline" onClick={() => editEvent(ev)} aria-label="Editar evento"><i className="bi bi-pencil-square"></i></button>
                <button className="inline-danger" onClick={() => deleteEventById(ev._id)} aria-label="Eliminar evento"><i className="bi bi-trash"></i></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      </div>

    </div>
  );
}













