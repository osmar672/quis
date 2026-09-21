import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🎵 Adivina la Música
      </Link>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/instructions" className={({ isActive }) => isActive ? 'active' : ''}>
            Instrucciones
          </NavLink>
        </li>
        <li>
          <NavLink to="/scores" className={({ isActive }) => isActive ? 'active' : ''}>
            Puntajes
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
