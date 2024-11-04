import { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

const ResearchGapAnalyzer = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState({
    summary1: '',
    summary2: '',
    summary3: '',
    llm_response: ''
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('Selected files:', selectedFiles);
    if (selectedFiles.length !== 3) {
      setError('Please select exactly 3 PDF files.');
      console.log('Error: Please select exactly 3 PDF files.');
      return;
    }
    
    const invalidFiles = selectedFiles.filter(file => file.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      setError('All files must be PDFs.');
      console.log('Error: All files must be PDFs.');
      return;
    }

    setFiles(selectedFiles);
    setError('');
    console.log('Files set successfully:', selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    if (files.length !== 3) {
      setError('Please select exactly 3 PDF files.');
      console.log('Error: Please select exactly 3 PDF files.');
      return;
    }

    setLoading(true);
    setError('');
    console.log('Loading set to true');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('pdf_files', file);
    });
    console.log('FormData prepared:', formData);

    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);
      console.log('Results received:', data);
    } catch (err) {
      setError('Failed to analyze files. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    console.log('File removed:', updatedFiles);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Research Gap Analyzer</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Drop 3 PDF files here or click to upload
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || files.length !== 3}
              className={`w-full py-2 px-4 rounded font-medium text-white ${
                loading || files.length !== 3
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                'Analyze Research Gaps'
              )}
            </button>
          </div>
        </form>

        {(results.summary1 || results.summary2 || results.summary3) && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-bold">Paper Summaries</h3>
            <div className="space-y-2">
              <div className="p-4 bg-gray-50 rounded shadow-sm">
                <h4 className="font-medium">Summary 1:</h4>
                <p>{results.summary1}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded shadow-sm">
                <h4 className="font-medium">Summary 2:</h4>
                <p>{results.summary2}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded shadow-sm">
                <h4 className="font-medium">Summary 3:</h4>
                <p>{results.summary3}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-6">Research Gap Analysis</h3>
            <div className="p-4 bg-gray-50 rounded shadow-sm">
              <p>{results.llm_response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchGapAnalyzer;
