import { useMemo, useState } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { getStartOfDay, getStartOfWeek, isSameDay, isWithinWeek } from '../utils/timeFormat';
import './Statistics.css';

const Statistics = ({ isOpen, onClose }) => {
  const { state } = usePomodoro();
  const [viewMode, setViewMode] = useState('daily');

  const todayStats = useMemo(() => {
    const today = getStartOfDay();
    const todayLogs = state.logs.filter(log => isSameDay(log.startTime, today));
    const totalSeconds = todayLogs.reduce((acc, log) => acc + log.duration, 0);
    return {
      pomodoroCount: todayLogs.length,
      totalMinutes: Math.floor(totalSeconds / 60),
      logs: todayLogs
    };
  }, [state.logs]);

  const weekStats = useMemo(() => {
    const weekStart = getStartOfWeek();
    const weekLogs = state.logs.filter(log => isWithinWeek(log.startTime, weekStart));
    const totalSeconds = weekLogs.reduce((acc, log) => acc + log.duration, 0);

    // Group by day
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dayLogs = weekLogs.filter(log => isSameDay(log.startTime, day));
      const dayMinutes = dayLogs.reduce((acc, log) => acc + log.duration, 0) / 60;
      dailyData.push({
        date: day,
        minutes: Math.floor(dayMinutes),
        count: dayLogs.length
      });
    }

    return {
      pomodoroCount: weekLogs.length,
      totalMinutes: Math.floor(totalSeconds / 60),
      dailyData
    };
  }, [state.logs]);

  const maxMinutes = useMemo(() => {
    return weekStats.dailyData.reduce((max, d) => Math.max(max, d.minutes), 1);
  }, [weekStats.dailyData]);

  if (!isOpen) return null;

  return (
    <div className="statistics-overlay" onClick={onClose}>
      <div className="statistics-modal" onClick={e => e.stopPropagation()}>
        <div className="statistics-header">
          <h2>統計</h2>
          <button className="statistics-close" onClick={onClose} aria-label="閉じる">×</button>
        </div>

        <div className="statistics-tabs">
          <button
            className={`statistics-tab ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            今日
          </button>
          <button
            className={`statistics-tab ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            今週
          </button>
        </div>

        <div className="statistics-content">
          {viewMode === 'daily' && (
            <div className="statistics-section">
              <div className="stats-summary">
                <div className="stat-card">
                  <span className="stat-value">{todayStats.pomodoroCount}</span>
                  <span className="stat-label">ポモドーロ</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{todayStats.totalMinutes}</span>
                  <span className="stat-label">分</span>
                </div>
              </div>

              {todayStats.logs.length > 0 ? (
                <div className="stats-logs">
                  <h3>今日のログ</h3>
                  <ul className="log-list">
                    {todayStats.logs.map(log => (
                      <li key={log.id} className="log-item">
                        <span className="log-task">{log.taskName}</span>
                        <span className="log-duration">{Math.floor(log.duration / 60)}分</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="no-data">今日はまだ記録がありません</p>
              )}
            </div>
          )}

          {viewMode === 'weekly' && (
            <div className="statistics-section">
              <div className="stats-summary">
                <div className="stat-card">
                  <span className="stat-value">{weekStats.pomodoroCount}</span>
                  <span className="stat-label">ポモドーロ</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{weekStats.totalMinutes}</span>
                  <span className="stat-label">分</span>
                </div>
              </div>

              <div className="weekly-chart">
                <h3>週間グラフ</h3>
                <div className="chart-container">
                  {weekStats.dailyData.map((day, index) => (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar" 
                        style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                        title={`${day.minutes}分 (${day.count}ポモドーロ)`}
                      >
                        {day.minutes > 0 && (
                          <span className="bar-value">{day.minutes}</span>
                        )}
                      </div>
                      <span className="chart-label">
                        {['日', '月', '火', '水', '木', '金', '土'][day.date.getDay()]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
