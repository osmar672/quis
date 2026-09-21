import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Scores.css'

const API_URL = 'http://localhost:3001'

function Scores() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchScores() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/scores?_sort=score&_order=desc`)
        if (!res.ok) throw new Error('No se pudieron cargar los puntajes')
        const data = await res.json()
        if (!cancelled) setScores(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchScores()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="scores-page">
      <h1>🏆 Tabla de líderes</h1>
      <p className="scores-subtitle">Los mejores puntajes guardados</p>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Cargando...</p>
        </div>
      )}

      {error && (
        <div className="error card">
          <p>{error}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Ejecuta <code>npm run server</code> para activar la API local.
          </p>
        </div>
      )}

      {!loading && !error && scores.length === 0 && (
        <div className="card empty">
          <p>Aún no hay puntajes. ¡Sé el primero en jugar!</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Ir a jugar
          </Link>
        </div>
      )}

      {!loading && !error && scores.length > 0 && (
        <div className="scores-table-wrapper card">
          <table className="scores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Puntaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, index) => (
                <tr key={s.id}>
                  <td className="rank">{index + 1}</td>
                  <td>{s.player}</td>
                  <td className="score-cell">{s.score}</td>
                  <td className="date-cell">
                    {s.date ? new Date(s.date).toLocaleDateString('es') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Scores
