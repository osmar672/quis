import './ScoreBoard.css'

/**
 * Componente reutilizable: muestra puntaje, vidas y ronda actual.
 * Recibe datos vía props desde el padre.
 */
function ScoreBoard({ score, lives, round, totalRounds, playerName }) {
  return (
    <div className="scoreboard card">
      <div className="scoreboard-item">
        <span className="label">Jugador</span>
        <span className="value">{playerName || '—'}</span>
      </div>
      <div className="scoreboard-item">
        <span className="label">Puntaje</span>
        <span className="value score">{score}</span>
      </div>
      <div className="scoreboard-item">
        <span className="label">Vidas</span>
        <span className="value lives">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={`life-${i}`} className={i < lives ? 'heart full' : 'heart empty'}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </span>
      </div>
      <div className="scoreboard-item">
        <span className="label">Ronda</span>
        <span className="value">{round} / {totalRounds}</span>
      </div>
    </div>
  )
}

export default ScoreBoard
