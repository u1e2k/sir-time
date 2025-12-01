import { useState } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import './MemoInput.css';

const MemoInput = () => {
  const { state, dispatch } = usePomodoro();
  const [memoText, setMemoText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (memoText.trim()) {
      dispatch({ type: 'ADD_MEMO', payload: memoText.trim() });
      setMemoText('');
    }
  };

  const handleRemoveMemo = (id) => {
    dispatch({ type: 'REMOVE_MEMO', payload: id });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_MEMOS' });
  };

  return (
    <div className="memo-container">
      <button 
        className="memo-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        💡 割り込みメモ {state.memos.length > 0 && `(${state.memos.length})`}
      </button>

      {isExpanded && (
        <div className="memo-panel">
          <form onSubmit={handleSubmit} className="memo-form">
            <input
              type="text"
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="思いついたことをメモ..."
              className="memo-input"
            />
            <button type="submit" className="memo-add-btn" disabled={!memoText.trim()}>
              追加
            </button>
          </form>

          {state.memos.length > 0 && (
            <>
              <ul className="memo-list">
                {state.memos.map((memo) => (
                  <li key={memo.id} className="memo-item">
                    <span className="memo-text">{memo.text}</span>
                    <button
                      className="memo-remove-btn"
                      onClick={() => handleRemoveMemo(memo.id)}
                      aria-label="削除"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button className="memo-clear-btn" onClick={handleClearAll}>
                すべてクリア
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoInput;
