import { useState } from 'react';
import { X, Lock, Globe, ChevronDown, Check, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ShareModal = ({ shareFile, setShareFile, handleCopyLink }) => {
  const [accessLevel, setAccessLevel] = useState(shareFile?.accessLevel || (shareFile?.isPublic ? 'public' : 'restricted')); 
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sharedEmails, setSharedEmails] = useState(shareFile?.sharedWith?.map(s => s.user?.email).filter(Boolean) || []);
  const { user } = useAuth();

  if (!shareFile) return null;

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' && emailInput) {
      if (!sharedEmails.includes(emailInput) && emailInput !== user.email) {
        setSharedEmails([...sharedEmails, emailInput]);
      }
      setEmailInput('');
    }
  };

  const removeEmail = (email) => {
    setSharedEmails(sharedEmails.filter(e => e !== email));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Share "{shareFile.name}"</h3>
            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" onClick={() => setShareFile(null)}>
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleAddEmail}
                placeholder="Add people by email (press Enter)"
                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">People with access</h4>
            <div className="space-y-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold uppercase text-sm border border-violet-200 dark:border-violet-800">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name} (you)</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Owner</span>
              </div>

              {sharedEmails.map((email) => (
                <div key={email} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase text-sm border border-slate-200 dark:border-slate-700">
                      {email.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{email}</p>
                      <p className="text-xs text-slate-500">Viewer</p>
                    </div>
                  </div>
                  <button onClick={() => removeEmail(email)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">General access</h4>
            <div className="relative">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="mt-1 p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm border border-slate-100 dark:border-slate-600">
                  {accessLevel === 'restricted' ? (
                    <Lock size={16} className="text-slate-500" />
                  ) : (
                    <Globe size={16} className="text-emerald-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div 
                    className="flex items-center gap-1 cursor-pointer group w-fit"
                    onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {accessLevel === 'restricted' ? 'Restricted' : 'Anyone with the link'}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {accessLevel === 'restricted' 
                      ? 'Only people with access can open with the link' 
                      : 'Anyone on the internet with this link can view'}
                  </p>
                </div>
              </div>

              {showAccessDropdown && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[70] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => {
                      setAccessLevel('restricted');
                      setShowAccessDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-slate-500" />
                      <div>
                        <p className="font-semibold">Restricted</p>
                        <p className="text-[10px] text-slate-400">Private to selected people</p>
                      </div>
                    </div>
                    {accessLevel === 'restricted' && <Check size={16} className="text-blue-600" />}
                  </button>
                  <button 
                    onClick={() => {
                      setAccessLevel('public');
                      setShowAccessDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-emerald-500" />
                      <div>
                        <p className="font-semibold">Anyone with the link</p>
                        <p className="text-[10px] text-slate-400">Public visibility</p>
                      </div>
                    </div>
                    {accessLevel === 'public' && <Check size={16} className="text-blue-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => handleCopyLink(shareFile)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full font-bold text-sm transition-all"
            >
              <Link2 size={18} />
              Copy link
            </button>
            <button 
              onClick={async () => {
                try {
                  const { fileAPI } = await import('../services/api');
                  await fileAPI.updateFile(shareFile._id, {
                    isPublic: accessLevel === 'public',
                    accessLevel: accessLevel,
                    emails: sharedEmails
                  });
                  setShareFile(null);
                } catch (error) {
                  console.error('Failed to update sharing', error);
                  alert('Failed to update sharing settings');
                }
              }}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
