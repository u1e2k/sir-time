// Notification utility functions

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  try {
    return new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });
  } catch (e) {
    console.error('Failed to show notification:', e);
    return null;
  }
};

// Audio playback
const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

export const ALARM_SOUNDS = {
  bell: {
    name: 'ベル',
    frequency: [523.25, 659.25, 783.99], // C5, E5, G5 chord
    duration: 0.3
  },
  chime: {
    name: 'チャイム',
    frequency: [880, 1046.5, 1318.5], // A5, C6, E6
    duration: 0.4
  },
  gentle: {
    name: 'ジェントル',
    frequency: [440, 554.37, 659.25], // A4, C#5, E5
    duration: 0.5
  },
  alert: {
    name: 'アラート',
    frequency: [1000, 800, 1000], // alternating
    duration: 0.2
  }
};

export const playAlarm = (alarmType = 'bell') => {
  if (!audioContext) {
    console.log('AudioContext not supported');
    return;
  }

  const alarm = ALARM_SOUNDS[alarmType] || ALARM_SOUNDS.bell;
  
  // Resume context if suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  alarm.frequency.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime + index * alarm.duration;
    const endTime = startTime + alarm.duration;

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
};
