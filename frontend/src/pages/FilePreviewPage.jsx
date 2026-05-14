import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, FileText, X } from 'lucide-react';
import { fileAPI } from '../services/api';
import DocxViewer from '../components/DocxViewer';
import PptxViewer from '../components/PptxViewer';
import { getFileIcon } from '../components/FileIcon';

export default function FilePreviewPage() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const { data } = await fileAPI.getFiles({ id }); // Assuming the backend can filter by ID or I should add a specific method
        // If getFiles returns an array, pick the first one
        const targetFile = Array.isArray(data) ? data.find(f => f._id === id) : data;
        if (!targetFile) throw new Error('File not found');
        setFile(targetFile);
      } catch (err) {
        console.error('Failed to load file preview', err);
        setError('File not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id]);

  const handleDownload = () => {
    const serverUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';
    const link = document.createElement('a');
    link.href = `${serverUrl}${file.url}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full"></div>
          <p className="text-slate-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-8">{error || "We couldn't find the file you're looking for."}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const serverUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            {getFileIcon(file.type, file.name)}
            <h1 className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] md:max-w-md" title={file.name}>
              {file.name}
            </h1>
          </div>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </nav>

      {/* Preview Area */}
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 md:p-8 overflow-hidden relative">
            {file.type.includes('image') ? (
              <div className="w-full h-full flex items-center justify-center">
                <img src={`${serverUrl}${file.url}`} alt={file.name} className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
              </div>
            ) : file.type.includes('pdf') ? (
              <iframe src={`${serverUrl}${file.url}`} className="w-full h-full rounded-xl border-0 bg-white shadow-sm" title={file.name} />
            ) : file.name.endsWith('.docx') ? (
              <DocxViewer url={`${serverUrl}${file.url}`} />
            ) : file.name.endsWith('.pptx') || file.name.endsWith('.ppt') ? (
              <PptxViewer url={file.url} name={file.name} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <FileText size={80} className="mb-6 opacity-20" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Preview Unavailable</h3>
                <p className="text-slate-500 mt-2">This file type cannot be previewed online.</p>
                <button 
                  onClick={handleDownload}
                  className="mt-8 text-indigo-600 font-bold hover:underline"
                >
                  Download to view
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
