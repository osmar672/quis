import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleStart = (e) => {
    e.preventDefault()
    const name = playerName.trim()
    if (name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    if (name.length > 20) {
      setError('Máximo 20 caracteres')
      return
    }
    setError('')
    // Ruta con parámetro dinámico
    navigate(`/game/${encodeURIComponent(name)}`)
  }

  return (
    <div className="home">
      <div className="home-hero card">
        <h1>🎵 Adivina la Música</h1>
        <p className="subtitle">
          Escucha un fragmento de canciones populares y adivina el título.
          ¡Demuestra cuánto conoces de los hits!
        </p>

        <form onSubmit={handleStart} className="start-form">
          <label htmlFor="playerName">Tu nombre de jugador</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ej: Maria, DJ_Alex..."
            maxLength={20}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary btn-lg">
            ¡Empezar a jugar!
          </button>
        </form>

        <div className="home-links">
          <a href="/instructions">Ver instrucciones</a>
          <span>·</span>
          <a href="/scores">Tabla de líderes</a>
        </div>
      </div>
    </div>
  )
}

export default Home
