# 🎵 Adivina la Música

Videojuego frontend de adivinar canciones populares.  
**Quiz #5 – Desarrollo Web Frontend**

## Descripción

Escucha un fragmento de ~30 segundos y elige el título correcto entre 4 opciones.  
Soporta **Spotify Web API** (previews reales) y fallback a audios locales.

## Cómo configurar Spotify

### 1. Crear la app en Spotify

1. Entra a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una **App** (tipo Web API)
3. En **Redirect URIs** pon **exactamente** (Spotify ya no permite `localhost`):

```
http://127.0.0.1:5173/callback
```

> Requisitos de Spotify:
> - Usa HTTPS, **excepto** en direcciones de bucle invertido (loopback).
> - En loopback usa IPv4 o IPv6 explícito: `http://127.0.0.1:PORT` o `http://[::1]:PORT`
> - `localhost` **no está permitido**

4. Guarda los cambios
5. Copia el **Client ID** y el **Client Secret**

### 2. Archivo `.env`

En la raíz del proyecto crea `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=tu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
```

### 3. Reiniciar Vite

```bash
npm run dev
```

Abre el juego en: **http://127.0.0.1:5173** (no uses `localhost` en la barra de direcciones si quieres que coincida con la Redirect URI).

> **Nota Premium:** los previews de 30 s funcionan sin Premium. Solo el Web Playback SDK exige Premium.

## Cómo ejecutar

```bash
npm install

# Terminal 1 – API local (puntajes + fallback)
npm run server
# → http://127.0.0.1:3001

# Terminal 2 – Frontend
npm run dev
# → http://127.0.0.1:5173
```

- Con Spotify configurado → canciones reales con preview.
- Sin Spotify → audios locales de `public/audio/`.

**Redirect URI del proyecto:** `http://127.0.0.1:5173/callback`

## Requisitos del quiz cumplidos

| Requisito | Implementación |
|-----------|----------------|
| ≥ 4 componentes | Navbar, ScoreBoard, SongPlayer, OptionsList, GameOver |
| Props + listas con key | OptionsList usa `key={opt.id}` |
| useState | score, lives, round, loading, error… |
| useEffect | carga de datos, fin de juego, guardado de puntaje |
| Hook adicional | useRef (audio), useCallback, useMemo |
| ≥ 3 rutas | `/`, `/game/:playerName`, `/scores`, `/instructions`, `/callback` |
| Ruta dinámica | `/game/:playerName` |
| GET + POST | GET canciones (Spotify o /songs) + POST /scores |
| Loading / error | Sí |
| Flujo n8n | Webhook → IF → Set → Respond |

## Estructura

```
adivina-musica/
├── .env.example
├── db.json
├── n8n/music-score-workflow.json
├── public/audio/
├── src/
│   ├── services/spotify.js
│   ├── components/
│   └── pages/
└── README.md
```

## n8n

Importa `n8n/music-score-workflow.json`.  
Cambia `N8N_WEBHOOK` en `src/pages/Game.jsx` por tu URL real.

## Autor

Proyecto individual – Quiz #5 Desarrollo Web Frontend
