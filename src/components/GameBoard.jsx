import './GameBoard.css'

export default function GameBoard({ difficulty, numbers, gameState, nextTarget, wrongCell, onCellClick }) {
  return (
    <div
      className="game-board"
      style={{ gridTemplateColumns: `repeat(${difficulty}, 1fr)` }}
    >
      {numbers.map((num) => {
        let cls = 'cell'
        if (gameState === 'completed' && num === nextTarget - 1) cls += ' done'
        else if (num < nextTarget && gameState === 'playing') cls += ' done'
        if (wrongCell === num) cls += ' shake'

        return (
          <button
            key={num}
            className={cls}
            onClick={() => onCellClick(num)}
            disabled={num < nextTarget && gameState === 'playing'}
          >
            <span className="cell-num">{num}</span>
          </button>
        )
      })}
    </div>
  )
}
