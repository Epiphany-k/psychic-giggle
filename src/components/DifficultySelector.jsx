import './DifficultySelector.css'

const SIZES = [3, 4, 5, 6, 7]

export default function DifficultySelector({ difficulty, onChange, disabled }) {
  return (
    <div className="difficulty-selector">
      <span className="label">难度</span>
      <div className="btn-group">
        {SIZES.map((size) => (
          <button
            key={size}
            className={`diff-btn ${size === difficulty ? 'active' : ''}`}
            onClick={() => onChange(size)}
            disabled={disabled}
          >
            {size}×{size}
          </button>
        ))}
      </div>
    </div>
  )
}
