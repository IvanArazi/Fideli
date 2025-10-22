import { useEffect, useState } from "react";
import "../styles/components/UsersAdmin.css"; // Importa los estilos

const API_URL = import.meta.env.VITE_API_URL;

export default function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar usuarios");
                setLoading(false);
            });
    }, []);

    return (
        <div className="users-admin-list">
            <h2>Usuarios</h2>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p>{error}</p>
            ) : users.length === 0 ? (
                <p>No hay usuarios registrados.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Número único</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.uniqueNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}