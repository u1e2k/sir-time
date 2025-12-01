import { createContext, useReducer, useEffect } from 'react';
import {
  loadSettings,
  saveSettings,
  loadLogs,
  saveLogs,
  loadMemos,
  saveMemos,
  loadPersonalTasks,
  savePersonalTasks,
  DEFAULT_SETTINGS
} from '../utils/storage';
import { TIMER_STATES } from '../constants/timerStates';

export const PomodoroContext = createContext(null);

const initialState = {
  settings: DEFAULT_SETTINGS,
  timerState: TIMER_STATES.IDLE,
  previousState: null,
  timeRemaining: DEFAULT_SETTINGS.focusDuration * 60,
  totalTime: DEFAULT_SETTINGS.focusDuration * 60,
  currentCycle: 1,
  currentTask: '',
  logs: [],
  memos: [],
  personalTasks: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  sessionStartTime: null
};

const pomodoroReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        settings: action.payload.settings,
        logs: action.payload.logs,
        memos: action.payload.memos,
        personalTasks: action.payload.personalTasks,
        timeRemaining: action.payload.settings.focusDuration * 60,
        totalTime: action.payload.settings.focusDuration * 60
      };

    case 'START_TIMER':
      return {
        ...state,
        timerState: state.timerState === TIMER_STATES.PAUSED ? state.previousState : TIMER_STATES.FOCUS,
        previousState: null,
        sessionStartTime: state.sessionStartTime || new Date().toISOString()
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        previousState: state.timerState,
        timerState: TIMER_STATES.PAUSED
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timerState: TIMER_STATES.IDLE,
        previousState: null,
        timeRemaining: state.settings.focusDuration * 60,
        totalTime: state.settings.focusDuration * 60,
        currentCycle: 1,
        sessionStartTime: null
      };

    case 'TICK':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      };

    case 'START_BREAK': {
      const isLongBreak = state.currentCycle >= state.settings.cyclesBeforeLongBreak;
      const breakDuration = isLongBreak
        ? state.settings.longBreakDuration
        : state.settings.shortBreakDuration;
      return {
        ...state,
        timerState: isLongBreak ? TIMER_STATES.LONG_BREAK : TIMER_STATES.SHORT_BREAK,
        timeRemaining: breakDuration * 60,
        totalTime: breakDuration * 60
      };
    }

    case 'START_FOCUS': {
      const nextCycle = state.timerState === TIMER_STATES.LONG_BREAK
        ? 1
        : state.currentCycle + 1;
      return {
        ...state,
        timerState: TIMER_STATES.FOCUS,
        timeRemaining: state.settings.focusDuration * 60,
        totalTime: state.settings.focusDuration * 60,
        currentCycle: state.timerState === TIMER_STATES.IDLE ? state.currentCycle : nextCycle,
        sessionStartTime: new Date().toISOString()
      };
    }

    case 'ADD_LOG': {
      const newLogs = [...state.logs, action.payload];
      saveLogs(newLogs);
      return {
        ...state,
        logs: newLogs,
        sessionStartTime: null
      };
    }

    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTask: action.payload
      };

    case 'ADD_MEMO': {
      const newMemos = [...state.memos, { id: Date.now(), text: action.payload, createdAt: new Date().toISOString() }];
      saveMemos(newMemos);
      return {
        ...state,
        memos: newMemos
      };
    }

    case 'REMOVE_MEMO': {
      const filteredMemos = state.memos.filter(m => m.id !== action.payload);
      saveMemos(filteredMemos);
      return {
        ...state,
        memos: filteredMemos
      };
    }

    case 'CLEAR_MEMOS':
      saveMemos([]);
      return {
        ...state,
        memos: []
      };

    case 'UPDATE_SETTINGS': {
      const updatedSettings = { ...state.settings, ...action.payload };
      saveSettings(updatedSettings);
      const newTimeRemaining = state.timerState === TIMER_STATES.IDLE
        ? updatedSettings.focusDuration * 60
        : state.timeRemaining;
      const newTotalTime = state.timerState === TIMER_STATES.IDLE
        ? updatedSettings.focusDuration * 60
        : state.totalTime;
      return {
        ...state,
        settings: updatedSettings,
        timeRemaining: newTimeRemaining,
        totalTime: newTotalTime
      };
    }

    case 'UPDATE_PERSONAL_TASKS':
      savePersonalTasks(action.payload);
      return {
        ...state,
        personalTasks: action.payload
      };

    default:
      return state;
  }
};

export const PomodoroProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);

  useEffect(() => {
    const settings = loadSettings();
    const logs = loadLogs();
    const memos = loadMemos();
    const personalTasks = loadPersonalTasks();
    dispatch({
      type: 'LOAD_DATA',
      payload: { settings, logs, memos, personalTasks }
    });
  }, []);

  return (
    <PomodoroContext.Provider value={{ state, dispatch, TIMER_STATES }}>
      {children}
    </PomodoroContext.Provider>
  );
};
