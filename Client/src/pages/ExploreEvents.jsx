import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/components/ExploreEvents.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function ExploreEvents(){
  const API_URL = import.meta.env.VITE_API_URL
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(async r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => Array.isArray(data) ? setEvents(data) : setEvents([]))
      .catch(() => setError('No se pudieron cargar los eventos'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = useMemo(() => {
    const now = new Date()
    return events
      .filter(e => new Date(e.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }, [events])

  return (
    <div className="expevents-page">
      <div className="ee-header">
        <button className="ee-back" aria-label="Volver" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>Próximos eventos</h2>
      </div>

      {loading && <div className="ee-loading">Cargando…</div>}
      {error && <p className="ee-msg error">{error}</p>}

      {!loading && !error && (
        upcoming.length === 0 ? (
          <p className="ee-msg">No hay eventos próximos por ahora.</p>
        ) : (
          <div className="ee-grid">
            {upcoming.map(ev => (
              <button key={ev._id} className="ee-card" onClick={() => setSelected(ev)}>
                <div className="ee-info">
                  <div className="title">{ev.title}</div>
                  <div className="meta">
                    <span className="brand">{ev.brandId?.name || '—'}</span>
                    <span className="date">{new Date(ev.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="location"><i className="bi bi-geo-alt"></i> {ev.location}</div>
                </div>
              </button>
            ))}
          </div>
        )
      )}

      {selected && (
        <div className="ee-modal-bg" onClick={() => setSelected(null)}>
          <div className="ee-modal" onClick={e => e.stopPropagation()}>
            <button className="ee-close" aria-label="Cerrar" onClick={() => setSelected(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <h3 className="ee-modal-title">{selected.title}</h3>
            <div className="ee-modal-meta">
              <span className="brand">{selected.brandId?.name || '—'}</span>
              <span className="date">{new Date(selected.startDate).toLocaleString()} - {new Date(selected.endDate).toLocaleString()}</span>
              <span className="hours">Horario: {selected.hours}</span>
              <span className="location"><i className="bi bi-geo-alt"></i> {selected.location}</span>
            </div>
            <p className="ee-modal-desc">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

