import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Game from './pages/Game'
import Scores from './pages/Scores'
import Instructions from './pages/Instructions'
import Callback from './pages/Callback'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:playerName" element={<Game />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>Adivina la Música · Quiz Frontend React · 2026</p>
      </footer>
    </div>
  )
}

export default App
