import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Folder, Users, Clock, Star, Trash2, Settings, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/shnoor.jpg';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'My Files', icon: Folder, path: '/files' },
  { name: 'Shared', icon: Users, path: '/shared' },
  { name: 'Recent', icon: Clock, path: '/recent' },
  { name: 'Starred', icon: Star, path: '/starred' },
  { name: 'Trash', icon: Trash2, path: '/trash' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on navigation (mobile)
    if (isOpen) onClose();
  }, [location.pathname]);
  const { user } = useAuth();
  
  const storageUsed = user?.storageUsed || 0;
  const storageLimit = user?.storageLimit || 15 * 1024 * 1024 * 1024;
  const storagePercent = Math.min(100, (storageUsed / storageLimit) * 100);

  const [uploading, setUploading] = useState(false);
  const handleSidebarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const queryParams = new URLSearchParams(location.search);
    const folderId = queryParams.get('folder');

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    try {
      setUploading(true);
      const { fileAPI } = await import('../services/api');
      await fileAPI.uploadFile(formData);
      window.dispatchEvent(new Event('file_uploaded'));
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = window.prompt('Enter folder name:');
    if (!name) return;

    try {
      const queryParams = new URLSearchParams(location.search);
      const folderId = queryParams.get('folder');
      
      const { folderAPI } = await import('../services/api');
      await folderAPI.createFolder(name, folderId);
      window.dispatchEvent(new Event('file_uploaded'));
    } catch (error) {
      console.error('Folder creation failed', error);
      alert('Failed to create folder');
    }
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Shnoor Cloud" className="w-10 h-10 rounded-xl object-cover shadow-md border-2 border-white dark:border-slate-800" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500 tracking-tight">
            Shnoor Cloud
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="px-4 pb-4 space-y-2">
        <label className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 px-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md cursor-pointer">
          <Plus size={20} />
          <span>{uploading ? 'Uploading...' : 'New Upload'}</span>
          <input type="file" className="hidden" onChange={handleSidebarUpload} disabled={uploading} />
        </label>
        <button 
          onClick={handleCreateFolder}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          <Folder size={20} className="text-slate-500" />
          <span>New Folder</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" 
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon size={18} className={isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400 dark:text-slate-500"} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500">Storage</span>
            <span className="font-medium">{(storageUsed / 1024 / 1024).toFixed(1)} MB / {(storageLimit / 1024 / 1024 / 1024).toFixed(0)} GB</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${storagePercent}%` }}></div>
          </div>
        </div>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <Settings size={18} className="text-slate-400" />
          Settings
        </Link>
      </div>
    </div>
  );
}
