import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Trash2, CloudUpload, Star, Edit2, RotateCcw, UserPlus, Lock, Globe, ChevronDown, Check, Link2, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fileAPI, folderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { getFileIcon } from '../components/FileIcon';
import DocxViewer from '../components/DocxViewer';
import PptxViewer from '../components/PptxViewer';
import ShareModal from '../components/ShareModal';
import FilePreviewModal from '../components/FilePreviewModal';


export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const folderId = queryParams.get('folder');

  const currentPath = location.pathname;

  const loadFiles = async () => {
    setLoading(true);
    try {
      let params = {};
      
      // Update path checks to account for /dashboard prefix
      const isStarredPage = currentPath === '/dashboard/starred';
      const isTrashPage = currentPath === '/dashboard/trash';
      const isRecentPage = currentPath === '/dashboard/recent';
      const isSharedPage = currentPath === '/dashboard/shared';
      const isFilesPage = currentPath === '/dashboard/files' || currentPath === '/dashboard';
      const isHomePage = currentPath === '/dashboard' && !folderId;

      if (isStarredPage) params.isStarred = true;
      if (isTrashPage) params.isTrashed = true;
      if (folderId) params.folder = folderId;
      
      const searchQuery = queryParams.get('q');
      if (searchQuery) params.search = searchQuery;

      const { data: fileData } = await fileAPI.getFiles(params);
      setFiles(fileData);

      if (isHomePage || isFilesPage) {
        const { data: folderData } = await folderAPI.getFolders({ parent: folderId || null });
        setFolders(folderData);
      }
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();

    const handleFileUploaded = () => {
      loadFiles();
      refreshUser();
    };
    window.addEventListener('file_uploaded', handleFileUploaded);

    return () => {
      window.removeEventListener('file_uploaded', handleFileUploaded);
    };
  }, [currentPath, location.search]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    try {
      setUploading(true);
      await fileAPI.uploadFile(formData);
      await loadFiles();
      await refreshUser();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAction = async (id, action, data = {}) => {
    try {
      if (action === 'delete_permanently') {
        if(!window.confirm('Delete permanently?')) return;
        await fileAPI.deleteFile(id);
        await refreshUser();
      } else {
        await fileAPI.updateFile(id, data);
      }
      await loadFiles();
    } catch (error) {
      console.error('Action failed', error);
    }
  };

  const handleRename = (file) => {
    const newName = window.prompt("Enter new name:", file.name);
    if (newName && newName !== file.name) {
      handleAction(file._id, 'rename', { name: newName });
    }
  };

  const handleCopyLink = (file) => {
    const clientUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5173';
    const fullUrl = `${clientUrl}/preview/${file._id}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert("Preview link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleDownload = (e, fileUrl, fileName) => {
    const serverUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:5001';
    e.preventDefault();
    const link = document.createElement('a');
    link.href = `${serverUrl}${fileUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageTitle = folderId 
    ? folders.find(f => f._id === folderId)?.name || "Folder"
    : currentPath === '/dashboard/recent' ? "Recent Files"
    : currentPath === '/dashboard/starred' ? "Starred Files"
    : currentPath === '/dashboard/trash' ? "Trash"
    : currentPath === '/dashboard/shared' ? "Shared with Me"
    : "Your Files";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {folderId && (
        <button 
          onClick={() => navigate(currentPath)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <RotateCcw size={16} />
          Back to Root
        </button>
      )}

      {(currentPath === '/dashboard' || currentPath === '/dashboard/files') && folders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">
              {folderId ? 'Folders' : 'Suggested Folders'}
            </h2>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {folders.map((folder) => (
              <div 
                key={folder._id} 
                onClick={() => navigate(`/dashboard/files?folder=${folder._id}`)}
                className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-600 shrink-0">
                  {getFileIcon('folder', folder.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-slate-900 dark:text-slate-100 block truncate text-xs md:text-sm">{folder.name}</span>
                  <span className="text-[10px] text-slate-500 block">in My Drive</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPath === '/dashboard' && !folderId && files.length > 0 && (
        <section>
          <h2 className="text-base md:text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Suggested Files</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {files.slice(0, 4).map((file) => (
              <div 
                key={file._id}
                onDoubleClick={() => setPreviewFile(file)}
                className="bg-white dark:bg-slate-800 p-3 md:p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0`}>
                   {getFileIcon(file.type, file.name)}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block truncate flex-1 text-xs md:text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPath !== '/trash' && (
        <section className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200">Upload a File</h2>
            <p className="text-xs md:text-sm text-slate-500">Store and share your files securely.</p>
          </div>
          <div className="w-full md:w-auto">
            <label className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
              <CloudUpload size={18} />
              {uploading ? 'Uploading...' : 'Browse File'}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-base md:text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{pageTitle}</h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden min-h-[300px] md:min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-slate-300" size={32} />
              </div>
              <p className="text-sm md:text-base">
                {currentPath === '/dashboard/trash' ? "Trash is empty." : "No files found here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 text-[10px] md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-4 md:px-6 py-4 font-semibold">Name</th>
                    <th className="px-4 md:px-6 py-4 font-semibold">Last Modified</th>
                    <th className="px-4 md:px-6 py-4 font-semibold">Size</th>
                    <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {files.map(file => (
                    <tr 
                      key={file._id} 
                      onDoubleClick={() => setPreviewFile(file)}
                      className="group border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type, file.name)}
                          <span className="font-medium text-slate-700 dark:text-slate-300 max-w-[200px] truncate" title={file.name}>{file.name}</span>
                          {file.isStarred && <Star size={14} className="text-amber-400 fill-amber-400" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                        {format(new Date(file.updatedAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          
                          {currentPath === '/dashboard/trash' ? (
                            <>
                              <button onClick={() => handleAction(file._id, 'restore', { isTrashed: false })} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Restore"><RotateCcw size={16} /></button>
                              <button onClick={() => handleAction(file._id, 'delete_permanently')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Permanently"><Trash2 size={16} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setShareFile(file)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Share"><UserPlus size={16} /></button>
                              <button onClick={(e) => handleDownload(e, file.url, file.name)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" title="Download"><Download size={16} /></button>
                              <button onClick={() => handleRename(file)} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors" title="Rename"><Edit2 size={16} /></button>
                              <button onClick={() => handleAction(file._id, 'star', { isStarred: !file.isStarred })} className={`p-1.5 rounded-md transition-colors ${file.isStarred ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`} title="Star"><Star size={16} className={file.isStarred ? 'fill-amber-500' : ''} /></button>
                              <button onClick={() => handleAction(file._id, 'trash', { isTrashed: true })} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Move to Trash"><Trash2 size={16} /></button>
                            </>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <FilePreviewModal 
        previewFile={previewFile} 
        setPreviewFile={setPreviewFile} 
        handleDownload={handleDownload} 
      />

      <ShareModal 
        shareFile={shareFile} 
        setShareFile={setShareFile} 
        handleCopyLink={handleCopyLink} 
      />

    </div>
  );
}
