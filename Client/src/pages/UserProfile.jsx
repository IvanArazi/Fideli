import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/UserProfile.css'

export default function UserProfile(){
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL
  const [form, setForm] = useState({ name:'', lastName:'', email:'', password:'' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return }
    fetch(`${API_URL}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { 
        setForm({ name: data.name||'', lastName: data.lastName||'', email: data.email||'', password:'' })
        if (data.profileImage) setPreview(`${API_URL}${data.profileImage}`)
      })
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const token = localStorage.getItem('token')
    try{
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('lastName', form.lastName)
      fd.append('email', form.email)
      if (form.password) fd.append('password', form.password)
      if (profileImageFile) fd.append('profileImage', profileImageFile)
      const r = await fetch(`${API_URL}/api/users/me`, { method:'PUT', headers: { Authorization: `Bearer ${token}` }, body: fd })
      if(!r.ok) throw new Error()
      setSuccess('Perfil actualizado')
      setForm(f => ({ ...f, password:'' }))
    }catch{
      setError('No se pudo actualizar')
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setProfileImageFile(file||null)
    if (file) setPreview(URL.createObjectURL(file))
  }

  if (loading) return <div className="profile-page"><div className="profile-card">Cargando…</div></div>

  return (
    <div className="profile-page user-profile">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>Tu Perfil</h2>
      </div>
      {error && <p className="msg msg-error">{error}</p>}
      {success && <p className="msg msg-success">{success}</p>}
      <div className="profile-card">
        <div className="avatar">
          {preview ? <img src={preview} alt="Foto de perfil" /> : <div className="avatar-empty"></div>}
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <label className="field">
            <span>Imagen de perfil</span>
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>
          <label className="field">
            <span>Nombre</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Apellido</span>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Nueva contraseña (opcional)</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </label>
          <div className="profile-actions">
            <button className="btn btn-primary" type="submit">Guardar cambios</button>
            <button className="btn btn-outline" type="button" onClick={() => { logout(); navigate('/login') }}>Cerrar sesión</button>
          </div>
        </form>
      </div>
    </div>
  )
}
