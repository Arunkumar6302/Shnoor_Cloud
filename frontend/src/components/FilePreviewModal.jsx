import { X, Download, FileText } from 'lucide-react';
import DocxViewer from './DocxViewer';
import PptxViewer from './PptxViewer';
import { getFileIcon } from './FileIcon';

const FilePreviewModal = ({ previewFile, setPreviewFile, handleDownload }) => {
  if (!previewFile) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[95vh] md:h-[90vh] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
              {getFileIcon(previewFile.type, previewFile.name)}
              {previewFile.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{previewFile.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => handleDownload(e, previewFile.url, previewFile.name)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Download">
              <Download size={20} />
            </button>
            <button onClick={() => setPreviewFile(null)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Close Preview">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-2 md:p-6 relative overflow-hidden flex flex-col">
          {(() => {
            const serverUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';
            const cleanUrl = previewFile.url.startsWith('/') ? previewFile.url : `/${previewFile.url}`;
            const fileUrl = `${serverUrl}${cleanUrl}`;
            if (previewFile.type.includes('image')) {
              return (
                <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                  <img src={fileUrl} alt={previewFile.name} className="max-w-full max-h-full object-contain" />
                </div>
              );
            }
            
            if (previewFile.type.includes('pdf')) {
              return <iframe src={fileUrl} className="flex-1 w-full h-full rounded-lg border-0 bg-white shadow-xl" title={previewFile.name} />;
            }
            
            if (previewFile.name.endsWith('.docx')) {
              return <DocxViewer url={fileUrl} />;
            }
            
            if (previewFile.name.endsWith('.pptx') || previewFile.name.endsWith('.ppt')) {
              return (
                <div className="flex-1 h-full">
                  <PptxViewer url={previewFile.url} name={previewFile.name} />
                </div>
              );
            }
            
            return (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <FileText size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">Preview not available for this file type</p>
                <p className="text-sm mt-2">Please download the file to view it.</p>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
};

export default FilePreviewModal;
