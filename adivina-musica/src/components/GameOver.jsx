import { Link } from 'react-router-dom'
import './GameOver.css'

/**
 * Componente reutilizable: pantalla de fin de partida.
 * Props: score, playerName, onRestart, saving, saveError, saved
 */
function GameOver({ score, playerName, onRestart, saving, saveError, saved }) {
  const message =
    score >= 80 ? '¡Increíble! Eres un experto musical 🏆' :
    score >= 50 ? '¡Buen trabajo! Conoces tus hits 🎸' :
    score >= 20 ? 'No está mal, sigue practicando 🎧' :
    '¡Sigue intentando, la música es para todos! 🎶'

  return (
    <div className="game-over card">
      <h2>Fin de la partida</h2>
      <p className="go-player">{playerName}</p>
      <p className="go-score">Puntaje final: <strong>{score}</strong></p>
      <p className="go-message">{message}</p>

      {saving && <p className="go-status">Guardando puntaje...</p>}
      {saved && <p className="go-status success">✓ Puntaje guardado</p>}
      {saveError && <p className="go-status error">Error al guardar: {saveError}</p>}

      <div className="go-actions">
        <button type="button" className="btn-primary" onClick={onRestart}>
          Jugar de nuevo
        </button>
        <Link to="/scores" className="btn-secondary" style={{ display: 'inline-block', textAlign: 'center' }}>
          Ver tabla de líderes
        </Link>
        <Link to="/" className="btn-outline" style={{ display: 'inline-block', textAlign: 'center' }}>
          Inicio
        </Link>
      </div>
    </div>
  )
}

export default GameOver
