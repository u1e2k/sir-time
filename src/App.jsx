import { useState, useEffect } from 'react';
import { PomodoroProvider } from './context/PomodoroContext';
import { usePomodoro } from './hooks/usePomodoro';
import Timer from './components/Timer';
import TaskInput from './components/TaskInput';
import MemoInput from './components/MemoInput';
import PersonalTasks from './components/PersonalTasks';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import { requestNotificationPermission } from './utils/notifications';
import './App.css';

const THEMES = {
  default: {
    '--focus-color': '#e74c3c',
    '--focus-color-hover': '#c0392b',
    '--break-color': '#27ae60',
    '--break-color-hover': '#219a52',
    '--paused-color': '#f39c12',
    '--paused-color-hover': '#d68910',
    '--idle-color': '#95a5a6',
    '--reset-color': '#7f8c8d',
    '--reset-color-hover': '#6c7a7b',
  },
  ocean: {
    '--focus-color': '#3498db',
    '--focus-color-hover': '#2980b9',
    '--break-color': '#1abc9c',
    '--break-color-hover': '#16a085',
    '--paused-color': '#9b59b6',
    '--paused-color-hover': '#8e44ad',
    '--idle-color': '#7f8c8d',
    '--reset-color': '#34495e',
    '--reset-color-hover': '#2c3e50',
  },
  forest: {
    '--focus-color': '#27ae60',
    '--focus-color-hover': '#219a52',
    '--break-color': '#16a085',
    '--break-color-hover': '#138d75',
    '--paused-color': '#f39c12',
    '--paused-color-hover': '#d68910',
    '--idle-color': '#7f8c8d',
    '--reset-color': '#795548',
    '--reset-color-hover': '#5d4037',
  },
  sunset: {
    '--focus-color': '#e74c3c',
    '--focus-color-hover': '#c0392b',
    '--break-color': '#f39c12',
    '--break-color-hover': '#d68910',
    '--paused-color': '#9b59b6',
    '--paused-color-hover': '#8e44ad',
    '--idle-color': '#95a5a6',
    '--reset-color': '#e67e22',
    '--reset-color-hover': '#d35400',
  },
  lavender: {
    '--focus-color': '#9b59b6',
    '--focus-color-hover': '#8e44ad',
    '--break-color': '#3498db',
    '--break-color-hover': '#2980b9',
    '--paused-color': '#e91e63',
    '--paused-color-hover': '#c2185b',
    '--idle-color': '#95a5a6',
    '--reset-color': '#607d8b',
    '--reset-color-hover': '#455a64',
  },
};

const AppContent = () => {
  const { state } = usePomodoro();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const theme = THEMES[state.settings.theme] || THEMES.default;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [state.settings.theme]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🍅 ポモドーロタイマー</h1>
        <div className="header-actions">
          <button
            className="header-btn"
            onClick={() => setIsStatsOpen(true)}
            aria-label="統計を表示"
          >
            📊
          </button>
          <button
            className="header-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="設定を開く"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="app-main">
        <TaskInput />
        <Timer />
        <MemoInput />
        <PersonalTasks />
      </main>

      <footer className="app-footer">
        <p>集中して、成果を出そう</p>
      </footer>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <Statistics isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <PomodoroProvider>
      <AppContent />
    </PomodoroProvider>
  );
}

export default App;
