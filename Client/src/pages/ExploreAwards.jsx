import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/components/ExploreAwards.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function ExploreAwards(){
  const API_URL = import.meta.env.VITE_API_URL
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/api/awards`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAwards(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudieron cargar los premios'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="exploreawards-page">
      <div className="ea-header">
        <button className="ea-back" aria-label="Volver" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>Premios disponibles</h2>
      </div>

      {loading && <div className="ea-loading">Cargando…</div>}
      {error && <p className="ea-msg error">{error}</p>}

      {!loading && !error && (
        awards.length === 0 ? (
          <p className="ea-msg">No hay premios disponibles por ahora.</p>
        ) : (
          <div className="ea-grid">
            {awards.map(a => (
              <button key={a._id} className="ea-card" onClick={() => navigate(`/user/award/${a._id}`)}>
                <div className="ea-thumb">
                  <img src={a.image ? `${API_URL}${a.image}` : '/default-award.png'} alt={a.name} />
                </div>
                <div className="ea-info">
                  <span className="title" title={a.name}>{a.name}</span>
                  <span className="points"><i className="bi bi-coin"></i> {a.requiredPoints}</span>
                </div>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  )
}


