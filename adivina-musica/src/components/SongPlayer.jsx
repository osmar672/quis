import { useRef, useEffect, useCallback, useState } from 'react'
import './SongPlayer.css'

/**
 * Componente reutilizable: reproduce el preview de la canción.
 * Usa useRef para controlar el elemento <audio>.
 * Los audios están en /public/audio/ (locales) → sin problemas de CORS.
 */
function SongPlayer({ song, isPlaying, onEnded, disabled }) {
  const audioRef = useRef(null)
  const [audioError, setAudioError] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const handlePlay = useCallback(() => {
    if (audioRef.current && !disabled) {
      setAudioError(false)
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Error al reproducir:', err)
          setAudioError(true)
        })
      }
    }
  }, [disabled])

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  // Cuando cambia la canción, resetear y cargar
  useEffect(() => {
    setAudioError(false)
    setIsReady(false)
    if (audioRef.current && song?.preview) {
      audioRef.current.load()
    }
  }, [song?.id, song?.preview])

  useEffect(() => {
    if (isPlaying) {
      handlePlay()
    } else {
      handlePause()
    }
  }, [isPlaying, song?.id, handlePlay, handlePause])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onCanPlay = () => setIsReady(true)
    const onEnd = () => onEnded?.()
    const onError = () => setAudioError(true)

    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
  }, [onEnded, song?.id])

  if (!song) return null

  return (
    <div className="song-player card">
      <div className="cover-wrapper">
        <img
          src={song.cover || 'https://via.placeholder.com/200?text=🎵'}
          alt={`Portada de ${song.title}`}
          className="cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=🎵' }}
        />
        {isPlaying && !audioError && <div className="pulse" />}
      </div>

      <p className="hint">
        {audioError
          ? '⚠️ No se pudo cargar el audio. Puedes seguir eligiendo una opción.'
          : '🎧 Escucha el fragmento y adivina la canción'}
      </p>

      <audio
        ref={audioRef}
        src={song.preview}
        preload="auto"
        crossOrigin="anonymous"
      />

      <div className="player-controls">
        <button
          type="button"
          className="btn-primary"
          onClick={handlePlay}
          disabled={disabled || audioError}
        >
          ▶️ Reproducir
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={handlePause}
          disabled={disabled}
        >
          ⏸️ Pausar
        </button>
      </div>

      {!isReady && !audioError && (
        <p className="loading-audio">Cargando audio...</p>
      )}
    </div>
  )
}

export default SongPlayer
