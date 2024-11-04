// AnalysisHistory.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './AnalysisHistory.css';

// eslint-disable-next-line react/prop-types
const AnalysisHistory = ({ savedResults }) => {
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState({});
  const [comparison, setComparison] = useState([null, null]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    const savedNotes = JSON.parse(localStorage.getItem('analysisNotes')) || {};
    setHistory(savedHistory);
    setNotes(savedNotes);
  }, []);

  const handleSaveResult = () => {
    // eslint-disable-next-line react/prop-types
    if (savedResults.summary1 || savedResults.llm_response) {
      const newHistory = [savedResults, ...history].slice(0, 5); // Keep only the latest 5 results
      setHistory(newHistory);
      localStorage.setItem('analysisHistory', JSON.stringify(newHistory));
    }
  };

  const handleNoteChange = (index, note) => {
    const updatedNotes = { ...notes, [index]: note };
    setNotes(updatedNotes);
    localStorage.setItem('analysisNotes', JSON.stringify(updatedNotes));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('analysisHistory');
      setHistory([]);
    }
  };

  const toggleComparison = (index) => {
    setComparison((prev) => {
      const updated = [...prev];
      if (updated[0] === index) updated[0] = null;
      else if (updated[1] === index) updated[1] = null;
      else if (updated[0] === null) updated[0] = index;
      else updated[1] = index;
      return updated;
    });
  };

  const renderComparison = () => {
    if (comparison[0] !== null && comparison[1] !== null) {
      const [first, second] = comparison.map(idx => history[idx]);
      return (
        <div className="comparison-view">
          <div className="comparison-section">
            <h4>Analysis {comparison[0] + 1}</h4>
            <p><strong>Summary 1:</strong> {first.summary1}</p>
            <p><strong>Research Gap:</strong> {first.llm_response}</p>
          </div>
          <div className="comparison-section">
            <h4>Analysis {comparison[1] + 1}</h4>
            <p><strong>Summary 1:</strong> {second.summary1}</p>
            <p><strong>Research Gap:</strong> {second.llm_response}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    handleSaveResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedResults]);

  return (
    <div className="history-container">
      <h3>Analysis History</h3>
      <button onClick={clearHistory} className="clear-history-btn">Clear All History</button>
      
      {renderComparison()}

      {history.length > 0 ? (
        <ul className="history-list">
          {history.map((result, index) => (
            <li key={index} className="history-item">
              <h4>Analysis {index + 1}</h4>
              <p><strong>Summary 1:</strong> {result.summary1}</p>
              <p><strong>Research Gap:</strong> {result.llm_response}</p>
              <textarea
                placeholder="Add notes here..."
                value={notes[index] || ''}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                className="notes-textarea"
              />
              <button onClick={() => toggleComparison(index)} className="compare-btn">
                {comparison.includes(index) ? 'Deselect' : 'Select for Comparison'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-history">No analysis history available.</p>
      )}
    </div>
  );
};

export default AnalysisHistory;
