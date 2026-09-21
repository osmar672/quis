import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ScoreBoard from '../components/ScoreBoard'
import SongPlayer from '../components/SongPlayer'
import OptionsList from '../components/OptionsList'
import GameOver from '../components/GameOver'
import { loadPopularSongsFromSpotify } from '../services/spotify'
import './Game.css'

const API_URL = 'http://localhost:3001'
const N8N_WEBHOOK = 'https://n8n.example.com/webhook/music-score' // Cambia por tu webhook de n8n
const TOTAL_ROUNDS = 8
const POINTS_PER_HIT = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Game() {
  const { playerName } = useParams()
  const navigate = useNavigate()
  const decodedName = decodeURIComponent(playerName || 'Anónimo')

  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('') // 'spotify' | 'local'
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Carga: primero intenta Spotify, si falla usa json-server (local)
  useEffect(() => {
    let cancelled = false

    async function loadSongs() {
      setLoading(true)
      setError(null)

      // 1) Intentar Spotify
      try {
        const spotifySongs = await loadPopularSongsFromSpotify()
        if (!cancelled && spotifySongs.length >= 4) {
          setSongs(shuffle(spotifySongs))
          setSource('spotify')
          setLoading(false)
          return
        }
      } catch (spotifyErr) {
        console.warn('Spotify no disponible, usando datos locales:', spotifyErr.message)
      }

      // 2) Fallback: json-server (db.json + audios locales)
      try {
        const res = await fetch(`${API_URL}/songs`)
        if (!res.ok) throw new Error(`Error ${res.status}: no se pudo cargar las canciones`)
        const data = await res.json()
        if (!cancelled) {
          if (!data || data.length < 4) {
            throw new Error('No hay suficientes canciones en la base de datos local')
          }
          setSongs(shuffle(data))
          setSource('local')
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message +
              '. Configura Spotify en .env o ejecuta "npm run server" para usar los audios locales.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSongs()
    return () => { cancelled = true }
  }, [])

  const rounds = useMemo(() => {
    if (songs.length === 0) return []
    return songs.slice(0, Math.min(TOTAL_ROUNDS, songs.length))
  }, [songs])

  const currentSong = rounds[round] || null

  const options = useMemo(() => {
    if (!currentSong || songs.length < 4) return []
    const others = songs.filter((s) => s.id !== currentSong.id)
    const wrong = shuffle(others).slice(0, 3)
    return shuffle([currentSong, ...wrong])
  }, [currentSong, songs])

  useEffect(() => {
    if (lives <= 0 || (round >= rounds.length && rounds.length > 0)) {
      setGameOver(true)
      setIsPlaying(false)
    }
  }, [lives, round, rounds.length])

  const saveScore = useCallback(async () => {
    setSaving(true)
    setSaveError(null)
    const payload = {
      player: decodedName,
      score,
      date: new Date().toISOString(),
      level: 'normal',
      source: source || 'unknown',
    }
    try {
      const res = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Error al guardar en servidor local')

      try {
        await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch {
        console.info('Webhook n8n no disponible (normal en desarrollo)')
      }

      setSaved(true)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }, [decodedName, score, source])

  useEffect(() => {
    if (gameOver && !saved && !saving) {
      saveScore()
    }
  }, [gameOver, saved, saving, saveScore])

  const handleSelect = useCallback(
    (id) => {
      if (selectedId !== null || gameOver) return
      setSelectedId(id)
      setIsPlaying(false)

      if (id === currentSong?.id) {
        setScore((s) => s + POINTS_PER_HIT)
      } else {
        setLives((l) => l - 1)
      }

      setTimeout(() => {
        setSelectedId(null)
        setRound((r) => r + 1)
        setIsPlaying(true)
      }, 1500)
    },
    [selectedId, gameOver, currentSong]
  )

  const handleRestart = useCallback(() => {
    setRound(0)
    setScore(0)
    setLives(3)
    setGameOver(false)
    setSelectedId(null)
    setSaved(false)
    setSaveError(null)
    setSongs((prev) => shuffle(prev))
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (!loading && !error && currentSong && !gameOver && selectedId === null) {
      setIsPlaying(true)
    }
  }, [loading, error, currentSong, gameOver, selectedId])

  if (!playerName) {
    navigate('/')
    return null
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Cargando canciones populares...</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Intentando Spotify → fallback local
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error card">
        <h2>Error al cargar datos</h2>
        <p>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <strong>Opción A:</strong> Configura Spotify (archivo <code>.env</code>)<br />
          <strong>Opción B:</strong> Ejecuta <code>npm run server</code> para usar audios locales
        </p>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }

  if (gameOver) {
    return (
      <GameOver
        score={score}
        playerName={decodedName}
        onRestart={handleRestart}
        saving={saving}
        saveError={saveError}
        saved={saved}
      />
    )
  }

  return (
    <div className="game-page">
      {source && (
        <p className="source-badge">
          Fuente: {source === 'spotify' ? '🟢 Spotify (previews reales)' : '🟡 Audios locales'}
        </p>
      )}
      <ScoreBoard
        score={score}
        lives={lives}
        round={round + 1}
        totalRounds={rounds.length}
        playerName={decodedName}
      />
      <SongPlayer
        song={currentSong}
        isPlaying={isPlaying}
        onEnded={() => setIsPlaying(false)}
        disabled={selectedId !== null}
      />
      <OptionsList
        options={options}
        onSelect={handleSelect}
        disabled={selectedId !== null}
        selectedId={selectedId}
        correctId={currentSong?.id}
      />
    </div>
  )
}

export default Game
