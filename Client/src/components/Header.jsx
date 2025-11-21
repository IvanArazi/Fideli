import { useState } from "react";
import logo from "../assets/logo.png";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../styles/components/Header.css";

export default function Header({ opciones = [], onSelect }) {

    const [seleccionado, setSeleccionado] = useState(opciones[0].valor);

    const handleClick = (valor) => {
        setSeleccionado(valor);
        if (onSelect) onSelect(valor);
    };

    return (
        <aside role="navigation" aria-label="Navegación principal">
            <img src={logo} alt="Fideli" />
            <nav className="menu">
                <ul>
                    {opciones.map((opcion) => (
                        <li
                            className={`menu-valor${seleccionado === opcion.valor ? " seleccionado" : ""}`}
                            key={opcion.valor}
                            onClick={() => handleClick(opcion.valor)}
                            aria-current={seleccionado === opcion.valor ? "page" : undefined}
                        >
                            <i
                                className={`bi ${opcion.icono} icono${seleccionado === opcion.valor ? " seleccionado" : ""}`}
                                aria-hidden="true"
                            ></i>
                            <span className="label">{opcion.nombre}</span>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
