import './Timer.css'

export default function Timer({ elapsedMs, running }) {
  const seconds = (elapsedMs / 1000).toFixed(2)

  return (
    <div className={`timer ${running ? 'running' : ''}`}>
      <span className="timer-label">用时</span>
      <span className="timer-value">{seconds}</span>
      <span className="timer-unit">秒</span>
    </div>
  )
}
