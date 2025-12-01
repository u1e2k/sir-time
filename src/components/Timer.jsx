import { useTimer } from '../hooks/useTimer';
import { TIMER_STATES } from '../constants/timerStates';
import { formatTime } from '../utils/timeFormat';
import './Timer.css';

const Timer = () => {
  const {
    timeRemaining,
    totalTime,
    timerState,
    currentCycle,
    settings,
    start,
    pause,
    reset
  } = useTimer();

  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStateLabel = () => {
    switch (timerState) {
      case TIMER_STATES.FOCUS:
        return '集中中';
      case TIMER_STATES.SHORT_BREAK:
        return '短い休憩';
      case TIMER_STATES.LONG_BREAK:
        return '長い休憩';
      case TIMER_STATES.PAUSED:
        return '一時停止中';
      default:
        return '準備完了';
    }
  };

  const getStateColor = () => {
    switch (timerState) {
      case TIMER_STATES.FOCUS:
        return 'var(--focus-color)';
      case TIMER_STATES.SHORT_BREAK:
      case TIMER_STATES.LONG_BREAK:
        return 'var(--break-color)';
      case TIMER_STATES.PAUSED:
        return 'var(--paused-color)';
      default:
        return 'var(--idle-color)';
    }
  };

  const isRunning = [TIMER_STATES.FOCUS, TIMER_STATES.SHORT_BREAK, TIMER_STATES.LONG_BREAK].includes(timerState);
  const isPaused = timerState === TIMER_STATES.PAUSED;
  const isIdle = timerState === TIMER_STATES.IDLE;

  return (
    <div className="timer-container">
      <div className="timer-state-label" style={{ color: getStateColor() }}>
        {getStateLabel()}
      </div>

      <div className="timer-circle">
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="var(--circle-bg)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={getStateColor()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 140 140)"
            className="progress-circle"
          />
        </svg>
        <div className="timer-display">
          <span className="timer-time">{formatTime(timeRemaining)}</span>
          <span className="timer-cycle">
            サイクル {currentCycle} / {settings.cyclesBeforeLongBreak}
          </span>
        </div>
      </div>

      <div className="timer-controls">
        {isIdle && (
          <button className="control-btn start-btn" onClick={start}>
            開始
          </button>
        )}
        {isRunning && (
          <button className="control-btn pause-btn" onClick={pause}>
            一時停止
          </button>
        )}
        {isPaused && (
          <button className="control-btn start-btn" onClick={start}>
            再開
          </button>
        )}
        {!isIdle && (
          <button className="control-btn reset-btn" onClick={reset}>
            リセット
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
