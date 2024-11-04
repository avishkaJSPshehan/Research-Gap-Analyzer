// ResearchGapAnalyzer.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './ResearchGapAnalyzer.css';
import AnalysisHistory from './AnalysisHistory';

// eslint-disable-next-line react/prop-types
const LoadingScreen = ({ onStart }) => (
  <div className="loading-screen">
    <h1>Welcome to Research Gap Analyzer</h1>
    <button onClick={onStart} className="start-button">Start</button>
  </div>
);

const ResearchGapAnalyzer = () => {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState({
    summary1: '',
    summary2: '',
    summary3: '',
    llm_response: ''
  });

  const handleStart = () => {
    setShowLoadingScreen(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length !== 3) {
      setError('Please select exactly 3 PDF files.');
      return;
    }

    const invalidFiles = selectedFiles.filter(file => file.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      setError('All files must be PDFs.');
      return;
    }

    setFiles(selectedFiles);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length !== 3) {
      setError('Please select exactly 3 PDF files.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('pdf_files', file));

    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to analyze files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const clearFiles = () => {
    setFiles([]);
    setError('');
    setResults({
      summary1: '',
      summary2: '',
      summary3: '',
      llm_response: ''
    });
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
  
    // Set the colors
    const titleColor = [103, 193, 245]; // RGB for #67c1f5
    const headerColor = [52, 160, 221]; // RGB for #34a0dc
    const summaryColor = [255, 255, 255]; // White for summaries
    const backgroundColor = [28, 28, 30]; // Background color for PDF
  
    // Set background color
    doc.setFillColor(...backgroundColor);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
    // Title
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(...titleColor);
    doc.setFontSize(22);
    doc.text('Research Gap Analysis', 10, 20);
    
    // Add a line break
    doc.setDrawColor(100);
    doc.line(10, 25, 200, 25); // Horizontal line
    
    // Add created date
    const createdDate = new Date().toLocaleDateString(); // Format the date
    doc.setTextColor(...headerColor);
    doc.setFontSize(16);
    doc.text(`Created on: ${createdDate}`, 10, 35);
  
    // Add another line break
    doc.setDrawColor(100);
    doc.line(10, 40, 200, 40); // Horizontal line
    
    // Header for research gap
    doc.setTextColor(...headerColor);
    doc.setFontSize(16);
    doc.text('Research Gap', 10, 50);
    
    // Research gap text
    doc.setTextColor(...summaryColor);
    doc.setFontSize(12);
    doc.text(results.llm_response, 10, 60, { maxWidth: 190 });
  
    // Save the PDF
    doc.save('Research_Gap_Analysis.pdf');
  };
  

  if (showLoadingScreen) {
    return <LoadingScreen onStart={handleStart} />;
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Research Gap Analyzer</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="file-upload-container">
            <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="file-upload-label">
              <Upload className="file-upload-icon" />
              <span>Drop 3 PDF files here or click to upload</span>
            </label>
          </div>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <FileText className="file-icon" />
                    <span>{file.name}</span>
                  </div>
                  <button type="button" onClick={() => removeFile(index)} className="file-remove-btn">
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || files.length !== 3} className="submit-button">
            {loading ? (
              <div className="loading-spinner">
                <Loader2 className="spinner-icon" />
                Analyzing...
              </div>
            ) : (
              'Analyze Research Gaps'
            )}
          </button>
          
          <button type="button" onClick={clearFiles} className="clear-history-btn">
            Clear All History
          </button>
        </form>

        {(results.summary1 || results.summary2 || results.summary3) && (
          <div className="results-section">
            <h3 className="section-title">Paper Summaries</h3>
            <div className="summary">
              <h4 className="summary-title">Summary 1:</h4>
              <p>{results.summary1}</p>
            </div>
            <div className="summary">
              <h4 className="summary-title">Summary 2:</h4>
              <p>{results.summary2}</p>
            </div>
            <div className="summary">
              <h4 className="summary-title">Summary 3:</h4>
              <p>{results.summary3}</p>
            </div>

            <h3 className="section-title">Research Gap Analysis</h3>
            <div className="research-gap">
              <p>{results.llm_response}</p>
            </div>
          </div>
        )}

        <button onClick={exportAsPDF} className="export-pdf-btn">Export as PDF</button>
      </div>

      <AnalysisHistory savedResults={results} />
    </div>
  );
};

export default ResearchGapAnalyzer;
