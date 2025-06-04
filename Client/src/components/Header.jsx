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
        <aside>
            <img src={logo} alt="Fideli" />
            <nav className="menu">
                <ul>
                    {opciones.map((opcion) => (
                        <li
                            className={`menu-valor${seleccionado === opcion.valor ? " seleccionado" : ""}`}
                            key={opcion.valor}
                            onClick={() => handleClick(opcion.valor)}
                        >
                            <i
                                className={`bi ${opcion.icono} icono${seleccionado === opcion.valor ? " seleccionado" : ""}`}
                            ></i>
                            {opcion.nombre}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}