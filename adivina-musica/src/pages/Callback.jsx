import { Link } from 'react-router-dom'
import './Callback.css'

/**
 * Ruta /callback
 * Spotify exige una Redirect URI al crear la app.
 * Debe ser: http://127.0.0.1:5173/callback
 * (localhost ya no está permitido)
 */
function Callback() {
  return (
    <div className="callback card">
      <h1>Callback de Spotify</h1>
      <p>
        Redirect URI configurada:
        <br />
        <code>http://127.0.0.1:5173/callback</code>
      </p>
      <p className="muted">
        En este juego usamos Client Credentials (previews de 30 s).
        No necesitas iniciar sesión aquí.
      </p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Volver al inicio
      </Link>
    </div>
  )
}

export default Callback
