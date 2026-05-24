import { useState, useEffect, useCallback, useRef } from 'react'
import DifficultySelector from './components/DifficultySelector'
import GameBoard from './components/GameBoard'
import Timer from './components/Timer'
import ScoreBoard from './components/ScoreBoard'
import './App.css'

const STORAGE_KEY = 'schulte-scores'

function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

function shuffleArray(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function App() {
  const [difficulty, setDifficulty] = useState(5)
  const [numbers, setNumbers] = useState(() => shuffleArray(25))
  const [gameState, setGameState] = useState('idle') // idle | playing | completed
  const [nextTarget, setNextTarget] = useState(1)
  const [startTime, setStartTime] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [scores, setScores] = useState(loadScores)
  const [wrongCell, setWrongCell] = useState(null)
  const timerRef = useRef(null)

  const totalCells = difficulty * difficulty

  const resetGame = useCallback((newDifficulty) => {
    const d = newDifficulty ?? difficulty
    setNumbers(shuffleArray(d * d))
    setNextTarget(1)
    setGameState('idle')
    setStartTime(null)
    setElapsedMs(0)
    setWrongCell(null)
  }, [difficulty])

  // 关闭浏览器页面时通知服务端自动退出
  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon('/shutdown')
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTime)
      }, 30)
    } else {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => clearInterval(timerRef.current)
  }, [gameState, startTime])

  const handleDifficultyChange = (d) => {
    setDifficulty(d)
    resetGame(d)
  }

  const handleCellClick = (num) => {
    if (gameState === 'completed') return

    if (gameState === 'idle') {
      if (num !== 1) {
        setWrongCell(num)
        setTimeout(() => setWrongCell(null), 300)
        return
      }
      const now = Date.now()
      setStartTime(now)
      setElapsedMs(0)
      setGameState('playing')
      setNextTarget(2)
      return
    }

    if (num !== nextTarget) {
      setWrongCell(num)
      setTimeout(() => setWrongCell(null), 300)
      return
    }

    if (nextTarget === totalCells) {
      const finishMs = Date.now() - startTime
      setElapsedMs(finishMs)
      setGameState('completed')
      setNextTarget(totalCells + 1)

      const prev = scores[difficulty]
      if (prev === undefined || finishMs < prev) {
        const newScores = { ...scores, [difficulty]: finishMs }
        setScores(newScores)
        saveScores(newScores)
      }
      return
    }

    setNextTarget(n => n + 1)
  }

  const handleRestart = () => resetGame()

  return (
    <div className="app">
      <h1 className="title">舒尔特表</h1>
      <DifficultySelector
        difficulty={difficulty}
        onChange={handleDifficultyChange}
        disabled={gameState === 'playing'}
      />
      <Timer
        elapsedMs={elapsedMs}
        running={gameState === 'playing'}
      />
      <GameBoard
        difficulty={difficulty}
        numbers={numbers}
        gameState={gameState}
        nextTarget={nextTarget}
        wrongCell={wrongCell}
        onCellClick={handleCellClick}
      />
      {gameState === 'completed' && (
        <div className="complete-banner">
          <span>完成！用时 {(elapsedMs / 1000).toFixed(2)} 秒</span>
          {scores[difficulty] === elapsedMs && <span className="new-record">新纪录!</span>}
          <button className="restart-btn" onClick={handleRestart}>再来一次</button>
        </div>
      )}
      <ScoreBoard scores={scores} currentDifficulty={difficulty} />
    </div>
  )
}
