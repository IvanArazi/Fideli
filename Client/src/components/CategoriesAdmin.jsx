import { useEffect, useState } from "react";
import "../styles/components/CategoriesAdmin.css";

export default function CategoriesAdmin() {
  const [form, setForm] = useState({ name: "", image: null });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setError("Error al cargar categorías"));
  }, [success]);

  const handleChange = e => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name || !form.image) {
      setError("Completá todos los campos y adjuntá una imagen");
      return;
    }
    const body = new FormData();
    body.append("name", form.name);
    body.append("image", form.image);

    const res = await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body,
    });
    if (res.ok) {
      setForm({ name: "", image: null });
      setSuccess("Categoría creada correctamente");
    } else {
      const data = await res.json();
      setError(data.msg || "Error al crear la categoría");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
        setSuccess("Categoría eliminada correctamente");
      } else {
        const data = await res.json();
        setError(data.msg || "Error al eliminar la categoría");
      }
    } catch {
      setError("Error al eliminar la categoría");
    }
  };

  return (
    <div className="categoriesadmin-container">
      <h2 className="categorie-title">Cargar nueva categoría</h2>
      <form className="category-form" onSubmit={handleSubmit}>
        <input className="input-name"
          name="name"
          placeholder="Nombre de la categoría"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept=".jpg,.jpeg,.png"
          onChange={handleChange}
          required
        />
        <button className="create" type="submit">Crear categoría</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      <h2 className="categories">Categorías</h2>
      <div className="category-list">
        {categories.map(cat => (
          <div className="category-row" key={cat._id}>
            <img
              src={cat.image ? `http://localhost:3000${cat.image}` : "/default-category.png"}
              alt={cat.name}
              className="category-img"
            />
            <span className="category-name">{cat.name}</span>
            <button className="delete-category" onClick={() => handleDelete(cat._id)}>
               <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}