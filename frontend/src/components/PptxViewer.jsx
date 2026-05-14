import { FileText, Download } from 'lucide-react';

const PptxViewer = ({ url, name }) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Microsoft Office Online viewer URL
  const serverUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const fileUrl = `${serverUrl}${cleanUrl}`;
  
  // Microsoft Office Online viewer URL
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  if (isLocalhost) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={48} className="text-orange-500" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">PowerPoint Presentation</h4>
          <p className="text-sm text-slate-500 text-center max-w-[250px] mb-8">
            The online viewer cannot reach files on localhost. Download to open in Microsoft PowerPoint for the best experience.
          </p>
          <a 
            href={fileUrl}
            download={name}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <Download size={20} />
            Download PPTX
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <iframe 
        src={viewerUrl} 
        className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white" 
        title={name}
      />
    </div>
  );
};

export default PptxViewer;
