/**
 * Spotify Web API – Client Credentials Flow
 * Obtiene previews de 30s de canciones populares.
 * No requiere que el jugador tenga Premium.
 * (El Web Playback SDK sí exige Premium, pero aquí solo usamos preview_url)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

let cachedToken = null
let tokenExpiresAt = 0

/**
 * Obtiene un access_token con Client Credentials.
 * Cachea el token hasta que expire.
 */
export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      'Faltan credenciales de Spotify. Crea un archivo .env con VITE_SPOTIFY_CLIENT_ID y VITE_SPOTIFY_CLIENT_SECRET'
    )
  }

  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error_description || `Error al obtener token de Spotify (${res.status})`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + data.expires_in * 1000
  return cachedToken
}

/**
 * Busca canciones y devuelve solo las que tienen preview_url.
 */
export async function searchTracksWithPreview(query = 'top hits', limit = 30) {
  const token = await getAccessToken()

  const url = new URL('https://api.spotify.com/v1/search')
  url.searchParams.set('q', query)
  url.searchParams.set('type', 'track')
  url.searchParams.set('limit', String(Math.min(limit, 50)))
  url.searchParams.set('market', 'US')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error(`Error Spotify Search: ${res.status}`)
  }

  const data = await res.json()
  const tracks = data.tracks?.items || []

  return tracks
    .filter((t) => t.preview_url)
    .map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      album: t.album?.name || '',
      preview: t.preview_url,
      cover: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
      genre: 'Spotify',
      external_url: t.external_urls?.spotify,
    }))
}

/**
 * Tracks de una playlist popular (Today's Top Hits por defecto).
 */
export async function getPlaylistTracks(playlistId = '37i9dQZF1DXcBWIGoYBM5M', limit = 30) {
  const token = await getAccessToken()

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&market=US`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) {
    throw new Error(`Error Spotify Playlist: ${res.status}`)
  }

  const data = await res.json()
  const items = data.items || []

  return items
    .map((item) => item.track)
    .filter((t) => t && t.preview_url)
    .map((t) => ({
      id: t.id,
      title: t.name,
      artist: t.artists.map((a) => a.name).join(', '),
      album: t.album?.name || '',
      preview: t.preview_url,
      cover: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '',
      genre: 'Spotify',
      external_url: t.external_urls?.spotify,
    }))
}

/**
 * Carga canciones populares desde Spotify (varias búsquedas + playlist).
 */
export async function loadPopularSongsFromSpotify() {
  const queries = [
    'top hits',
    'pop hits 2024',
    'year:2023-2025',
    'taylor swift',
    'the weeknd',
    'bad bunny',
    'dua lipa',
    'billie eilish',
  ]

  const all = []
  const seen = new Set()

  for (const q of queries) {
    try {
      const tracks = await searchTracksWithPreview(q, 12)
      for (const t of tracks) {
        if (!seen.has(t.id)) {
          seen.add(t.id)
          all.push(t)
        }
      }
      if (all.length >= 30) break
    } catch (e) {
      console.warn(`Búsqueda Spotify falló para "${q}":`, e.message)
    }
  }

  try {
    const playlistTracks = await getPlaylistTracks('37i9dQZF1DXcBWIGoYBM5M', 20)
    for (const t of playlistTracks) {
      if (!seen.has(t.id)) {
        seen.add(t.id)
        all.push(t)
      }
    }
  } catch (e) {
    console.warn('Playlist Spotify falló:', e.message)
  }

  return all
}
