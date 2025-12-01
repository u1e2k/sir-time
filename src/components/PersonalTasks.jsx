import { useMemo } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { getWeekDayName } from '../utils/timeFormat';
import './PersonalTasks.css';

const PersonalTasks = () => {
  const { state } = usePomodoro();
  const today = new Date().getDay();

  const todayTasks = useMemo(() => {
    return state.personalTasks[today] || [];
  }, [state.personalTasks, today]);

  if (todayTasks.length === 0) {
    return null;
  }

  return (
    <div className="personal-tasks-widget">
      <div className="personal-tasks-header">
        <span className="personal-tasks-icon">📋</span>
        <span className="personal-tasks-title">{getWeekDayName(today)}のタスク</span>
      </div>
      <ul className="personal-tasks-list-widget">
        {todayTasks.map(task => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalTasks;
