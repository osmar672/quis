import { Link } from 'react-router-dom'
import './Instructions.css'

function Instructions() {
  return (
    <div className="instructions card">
      <h1>📖 Instrucciones</h1>
      <ol>
        <li>Ingresa tu nombre en la pantalla de inicio y pulsa <strong>Empezar</strong>.</li>
        <li>Se reproducirá un fragmento de ~30 segundos de una canción popular.</li>
        <li>Elige entre las 4 opciones la canción correcta (título + artista).</li>
        <li>Cada acierto suma <strong>10 puntos</strong>. Cada error resta una vida.</li>
        <li>Tienes <strong>3 vidas</strong>. El juego termina cuando se acaban o completas las rondas.</li>
        <li>Al final se guarda tu puntaje automáticamente (local + webhook n8n).</li>
      </ol>
      <h2>Consejos</h2>
      <ul>
        <li>Puedes pausar y volver a reproducir el audio con los botones.</li>
        <li>Algunos previews pueden no cargar si la URL expiró; en ese caso elige al azar o reintenta.</li>
        <li>La tabla de líderes muestra los mejores puntajes guardados.</li>
      </ul>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
        Volver al inicio
      </Link>
    </div>
  )
}

export default Instructions
