import logo from "../assets/logo.png";
import local from "../assets/local.webp";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {

  return (
    <>
        <header>
            <img src={logo} alt="Fideli"/>
            <ul>
                <li><Link className="li-link" href="#">Funcionalidades</Link></li>
                <li><Link className="li-link" href="#">Sobre Nosotros</Link></li>
            </ul>
            <ul>
                <li><Link className="register-links1" to="/brand/register">Comercios</Link></li>
                <li><Link className="register-links2" to="/register">Clientes</Link></li>
            </ul>
        </header>

        <main>
            <section className="landing-section">
                <div className="landing-text">
                    <h1>Tu lealtad,<br/>premiada</h1>
                    <p>Somos una plataforma de fidelización que te permite acumular puntos y canjearlos por recompensas en tus comercios gastronómicos favoritos.</p>
                    <div className="landing-buttons">
                        <Link className="landing-button1" to="/register">Registrate</Link>
                        <Link className="landing-button2" to="/brand/register">Soy un comercio</Link>
                    </div>
                </div>
                <div className="landing-image">
                    <img src={local} alt="Local gastronómico" />
                </div>
            </section>
        </main>
    </>
  )
}