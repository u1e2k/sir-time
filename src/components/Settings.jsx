import { useState } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { TIMER_STATES } from '../constants/timerStates';
import { ALARM_SOUNDS, playAlarm } from '../utils/notifications';
import { getWeekDayShort } from '../utils/timeFormat';
import './Settings.css';

const Settings = ({ isOpen, onClose }) => {
  const { state, dispatch } = usePomodoro();
  const [activeTab, setActiveTab] = useState('timer');
  const [tempSettings, setTempSettings] = useState({ ...state.settings });
  const [tempPersonalTasks, setTempPersonalTasks] = useState({ ...state.personalTasks });
  const [newTaskDay, setNewTaskDay] = useState(0);
  const [newTaskText, setNewTaskText] = useState('');

  const isRunning = ![TIMER_STATES.IDLE, TIMER_STATES.PAUSED].includes(state.timerState);

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: tempSettings });
    dispatch({ type: 'UPDATE_PERSONAL_TASKS', payload: tempPersonalTasks });
    onClose();
  };

  const handleCancel = () => {
    setTempSettings({ ...state.settings });
    setTempPersonalTasks({ ...state.personalTasks });
    onClose();
  };

  const handleTestAlarm = () => {
    playAlarm(tempSettings.selectedAlarm);
  };

  const handleAddPersonalTask = () => {
    if (newTaskText.trim()) {
      setTempPersonalTasks(prev => ({
        ...prev,
        [newTaskDay]: [...(prev[newTaskDay] || []), { id: Date.now(), text: newTaskText.trim() }]
      }));
      setNewTaskText('');
    }
  };

  const handleRemovePersonalTask = (day, taskId) => {
    setTempPersonalTasks(prev => ({
      ...prev,
      [day]: prev[day].filter(t => t.id !== taskId)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={handleCancel}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>設定</h2>
          <button className="settings-close" onClick={handleCancel} aria-label="閉じる">×</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            タイマー
          </button>
          <button
            className={`settings-tab ${activeTab === 'notification' ? 'active' : ''}`}
            onClick={() => setActiveTab('notification')}
          >
            通知
          </button>
          <button
            className={`settings-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            定期タスク
          </button>
          <button
            className={`settings-tab ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            テーマ
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'timer' && (
            <div className="settings-section">
              {isRunning && (
                <div className="settings-warning">
                  ⚠️ タイマー実行中は時間設定の変更が適用されません
                </div>
              )}
              <div className="setting-item">
                <label>集中時間（分）</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={tempSettings.focusDuration}
                  onChange={e => handleSettingChange('focusDuration', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="setting-item">
                <label>短い休憩（分）</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tempSettings.shortBreakDuration}
                  onChange={e => handleSettingChange('shortBreakDuration', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="setting-item">
                <label>長い休憩（分）</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={tempSettings.longBreakDuration}
                  onChange={e => handleSettingChange('longBreakDuration', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="setting-item">
                <label>長い休憩までのサイクル数</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tempSettings.cyclesBeforeLongBreak}
                  onChange={e => handleSettingChange('cyclesBeforeLongBreak', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="setting-item checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={tempSettings.autoStartNextCycle}
                    onChange={e => handleSettingChange('autoStartNextCycle', e.target.checked)}
                  />
                  休憩後に自動で次のサイクルを開始
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="settings-section">
              <div className="setting-item">
                <label>アラーム音</label>
                <div className="alarm-selection">
                  <select
                    value={tempSettings.selectedAlarm}
                    onChange={e => handleSettingChange('selectedAlarm', e.target.value)}
                  >
                    {Object.entries(ALARM_SOUNDS).map(([key, sound]) => (
                      <option key={key} value={key}>{sound.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={handleTestAlarm} className="test-alarm-btn">
                    テスト
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="settings-section">
              <p className="settings-description">
                曜日ごとの定期タスクを登録すると、その日のタスクがホーム画面に表示されます。
              </p>
              <div className="personal-task-form">
                <select
                  value={newTaskDay}
                  onChange={e => setNewTaskDay(parseInt(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <option key={day} value={day}>{getWeekDayShort(day)}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  placeholder="タスク名"
                  onKeyDown={e => e.key === 'Enter' && handleAddPersonalTask()}
                />
                <button type="button" onClick={handleAddPersonalTask}>追加</button>
              </div>
              <div className="personal-tasks-list">
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  tempPersonalTasks[day]?.length > 0 && (
                    <div key={day} className="personal-tasks-day">
                      <h4>{getWeekDayShort(day)}</h4>
                      <ul>
                        {tempPersonalTasks[day].map(task => (
                          <li key={task.id}>
                            <span>{task.text}</span>
                            <button onClick={() => handleRemovePersonalTask(day, task.id)}>×</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="settings-section">
              <div className="setting-item">
                <label>テーマ</label>
                <select
                  value={tempSettings.theme}
                  onChange={e => handleSettingChange('theme', e.target.value)}
                >
                  <option value="default">デフォルト</option>
                  <option value="ocean">オーシャン</option>
                  <option value="forest">フォレスト</option>
                  <option value="sunset">サンセット</option>
                  <option value="lavender">ラベンダー</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="settings-btn cancel" onClick={handleCancel}>キャンセル</button>
          <button className="settings-btn save" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
