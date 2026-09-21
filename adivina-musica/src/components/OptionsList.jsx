import './OptionsList.css'

/**
 * Componente reutilizable: lista de opciones de respuesta.
 * Renderiza lista con key única y estable (id de la canción).
 * Props: options (array), onSelect, disabled, selectedId, correctId
 */
function OptionsList({ options, onSelect, disabled, selectedId, correctId }) {
  if (!options || options.length === 0) return null

  return (
    <ul className="options-list">
      {options.map((opt) => {
        let className = 'option-btn'
        if (selectedId !== null) {
          if (opt.id === correctId) className += ' correct'
          else if (opt.id === selectedId) className += ' wrong'
        }
        return (
          <li key={opt.id}>
            <button
              type="button"
              className={className}
              onClick={() => onSelect(opt.id)}
              disabled={disabled || selectedId !== null}
            >
              <span className="opt-title">{opt.title}</span>
              <span className="opt-artist">{opt.artist}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default OptionsList
