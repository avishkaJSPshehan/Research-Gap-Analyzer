// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './AnalysisHistory.css';

const AnalysisHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('analysisHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('analysisHistory');
      setHistory([]);
    }
  };

  return (
    <div className="history-container">
      <h3>Analysis History</h3>
      <button onClick={clearHistory} className="clear-history-btn">Clear All History</button>
      
      {history.length > 0 ? (
        <ul className="history-list">
          {history.map((result, index) => (
            <li key={index} className="history-item">
              <h4>Analysis {index + 1}</h4>
              <p><strong>Summary 1:</strong> {result.summary1}</p>
              <p><strong>Research Gap:</strong> {result.llm_response}</p>
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
