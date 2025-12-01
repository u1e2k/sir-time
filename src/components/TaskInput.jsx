import { useState } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import './TaskInput.css';

const TaskInput = () => {
  const { state, dispatch } = usePomodoro();
  const [isEditing, setIsEditing] = useState(false);
  const [tempTask, setTempTask] = useState(state.currentTask);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_CURRENT_TASK', payload: tempTask });
    setIsEditing(false);
  };

  const handleClick = () => {
    setTempTask(state.currentTask);
    setIsEditing(true);
  };

  return (
    <div className="task-input-container">
      <label className="task-label">現在のタスク</label>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            value={tempTask}
            onChange={(e) => setTempTask(e.target.value)}
            placeholder="タスク名を入力..."
            className="task-input"
            autoFocus
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <div className="task-display" onClick={handleClick}>
          {state.currentTask || 'クリックしてタスクを設定...'}
        </div>
      )}
    </div>
  );
};

export default TaskInput;
