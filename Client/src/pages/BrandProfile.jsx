import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/BrandProfile.css'

export default function BrandProfile(){
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL
  const [form, setForm] = useState({ name:'', email:'', phone:'', description:'', address:'', manager:'', password:'' })
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){ navigate('/brand/login'); return }
    fetch(`${API_URL}/api/brands/me/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setForm({ name: data.name||'', email: data.email||'', phone: data.phone||'', description: data.description||'', address: data.address||'', manager: data.manager||'', password:'' })
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
      Object.entries(form).forEach(([k,v]) => { if(v) fd.append(k, v) })
      if(profileImage) fd.append('profileImage', profileImage)
      const r = await fetch(`${API_URL}/api/brands/me/profile`, {
        method:'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      if(!r.ok) throw new Error()
      setSuccess('Perfil actualizado')
      setForm(f => ({ ...f, password:'' }))
    }catch{
      setError('No se pudo actualizar')
    }
  }

  if (loading) return <div className="profile-page"><div className="profile-card">Cargando…</div></div>

  return (
    <div className="profile-page brand-profile">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2>Perfil del Comercio</h2>
      </div>
      {error && <p className="msg msg-error">{error}</p>}
      {success && <p className="msg msg-success">{success}</p>}
      <div className="profile-card">
        <div className="avatar">
          {preview ? <img src={preview} alt="Logo del comercio" /> : <div className="avatar-empty"></div>}
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <label className="field"> <span>Nombre</span><input name="name" value={form.name} onChange={handleChange} required /> </label>
          <label className="field"> <span>Email</span><input type="email" name="email" value={form.email} onChange={handleChange} required /> </label>
          <label className="field"> <span>Teléfono</span><input name="phone" value={form.phone} onChange={handleChange} required /> </label>
          <label className="field"> <span>Descripción</span><textarea name="description" value={form.description} onChange={handleChange} /> </label>
          <label className="field"> <span>Dirección</span><input name="address" value={form.address} onChange={handleChange} /> </label>
          <label className="field"> <span>Encargado</span><input name="manager" value={form.manager} onChange={handleChange} /> </label>
          <label className="field"> <span>Nueva contraseña (opcional)</span><input type="password" name="password" value={form.password} onChange={handleChange} /> </label>
          <label className="field"> <span>Imagen de perfil</span><input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]||null; setProfileImage(f); if(f) setPreview(URL.createObjectURL(f)); }} /> </label>
          <div className="profile-actions">
            <button className="btn btn-primary" type="submit">Guardar cambios</button>
            <button className="btn btn-outline" type="button" onClick={() => { logout(); navigate('/brand/login') }}>Cerrar sesión</button>
          </div>
        </form>
      </div>
    </div>
  )
}
