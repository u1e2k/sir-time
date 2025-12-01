// localStorage utility functions

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  LOGS: 'pomodoro_logs',
  TASKS: 'pomodoro_tasks',
  MEMOS: 'pomodoro_memos',
  PERSONAL_TASKS: 'pomodoro_personal_tasks'
};

export const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesBeforeLongBreak: 4,
  autoStartNextCycle: false,
  selectedAlarm: 'bell',
  theme: 'default'
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return true;
  } catch (e) {
    console.error('Failed to save logs:', e);
    return false;
  }
};

export const loadLogs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load logs:', e);
    return [];
  }
};

export const saveMemos = (memos) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMOS, JSON.stringify(memos));
    return true;
  } catch (e) {
    console.error('Failed to save memos:', e);
    return false;
  }
};

export const loadMemos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMOS);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load memos:', e);
    return [];
  }
};

export const savePersonalTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PERSONAL_TASKS, JSON.stringify(tasks));
    return true;
  } catch (e) {
    console.error('Failed to save personal tasks:', e);
    return false;
  }
};

export const loadPersonalTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_TASKS);
    return stored ? JSON.parse(stored) : {
      0: [], // Sunday
      1: [], // Monday
      2: [], // Tuesday
      3: [], // Wednesday
      4: [], // Thursday
      5: [], // Friday
      6: []  // Saturday
    };
  } catch (e) {
    console.error('Failed to load personal tasks:', e);
    return { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  }
};
