import './ScoreBoard.css'

const SIZES = [3, 4, 5, 6, 7]

function formatMs(ms) {
  return (ms / 1000).toFixed(2) + ' 秒'
}

export default function ScoreBoard({ scores, currentDifficulty }) {
  return (
    <div className="scoreboard">
      <h3 className="score-title">历史最佳</h3>
      <div className="score-grid">
        {SIZES.map((size) => {
          const best = scores[size]
          const isCurrent = size === currentDifficulty
          return (
            <div key={size} className={`score-item ${isCurrent ? 'current' : ''}`}>
              <span className="score-diff">{size}×{size}</span>
              <span className="score-time">{best !== undefined ? formatMs(best) : '--'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
