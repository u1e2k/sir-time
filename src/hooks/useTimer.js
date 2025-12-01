import { useEffect, useRef, useCallback } from 'react';
import { usePomodoro } from './usePomodoro';
import { TIMER_STATES } from '../constants/timerStates';
import { playAlarm, showNotification } from '../utils/notifications';

export const useTimer = () => {
  const { state, dispatch } = usePomodoro();
  const intervalRef = useRef(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    const { timerState, settings, currentTask, sessionStartTime, currentCycle } = state;

    // Play alarm
    playAlarm(settings.selectedAlarm);

    if (timerState === TIMER_STATES.FOCUS) {
      // Log the completed focus session
      dispatch({
        type: 'ADD_LOG',
        payload: {
          id: Date.now(),
          taskName: currentTask || '無題のタスク',
          startTime: sessionStartTime,
          endTime: new Date().toISOString(),
          duration: settings.focusDuration * 60,
          cycle: currentCycle
        }
      });

      // Show notification
      showNotification('集中時間が終了しました！', {
        body: 'お疲れ様でした。休憩を取りましょう。',
        tag: 'pomodoro-focus-end'
      });

      // Start break
      dispatch({ type: 'START_BREAK' });
    } else if (timerState === TIMER_STATES.SHORT_BREAK || timerState === TIMER_STATES.LONG_BREAK) {
      // Show notification
      showNotification('休憩時間が終了しました！', {
        body: '次の集中セッションを始めましょう。',
        tag: 'pomodoro-break-end'
      });

      if (settings.autoStartNextCycle) {
        dispatch({ type: 'START_FOCUS' });
      } else {
        dispatch({ type: 'RESET_TIMER' });
      }
    }
  }, [state, dispatch]);

  useEffect(() => {
    const isRunning = [TIMER_STATES.FOCUS, TIMER_STATES.SHORT_BREAK, TIMER_STATES.LONG_BREAK].includes(state.timerState);
    const hasTimeRemaining = state.timeRemaining > 0;

    if (isRunning && hasTimeRemaining) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      clearTimerInterval();
    }

    return clearTimerInterval;
  }, [state.timerState, state.timeRemaining, clearTimerInterval, dispatch]);

  useEffect(() => {
    if (state.timeRemaining === 0 && state.timerState !== TIMER_STATES.IDLE && state.timerState !== TIMER_STATES.PAUSED) {
      handleTimerComplete();
    }
  }, [state.timeRemaining, state.timerState, handleTimerComplete]);

  const start = useCallback(() => {
    dispatch({ type: 'START_TIMER' });
  }, [dispatch]);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, [dispatch]);

  const reset = useCallback(() => {
    clearTimerInterval();
    dispatch({ type: 'RESET_TIMER' });
  }, [dispatch, clearTimerInterval]);

  const startFocus = useCallback(() => {
    dispatch({ type: 'START_FOCUS' });
  }, [dispatch]);

  return {
    timeRemaining: state.timeRemaining,
    totalTime: state.totalTime,
    timerState: state.timerState,
    currentCycle: state.currentCycle,
    settings: state.settings,
    start,
    pause,
    reset,
    startFocus
  };
};
