import { useAuth } from '../context/AuthContext';
import { User, Mail, HardDrive, Shield } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();

  const storageUsedMB = (user?.storageUsed / 1024 / 1024).toFixed(2);
  const storageLimitGB = (user?.storageLimit / 1024 / 1024 / 1024).toFixed(0);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Account Settings</h2>
        <p className="text-slate-500 mt-1">Manage your profile, storage, and security preferences.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        
        {/* Profile Section */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <User className="text-violet-500" size={20} />
            Profile Details
          </h3>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 text-white font-bold text-3xl flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <div className="font-medium text-slate-900 dark:text-white text-lg">{user?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Section */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <HardDrive className="text-violet-500" size={20} />
            Storage Overview
          </h3>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-end mb-3">
              <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">{storageUsedMB} <span className="text-lg text-slate-500 font-normal">MB</span></div>
                <div className="text-sm text-slate-500 mt-1">Used of {storageLimitGB} GB total storage</div>
              </div>
              <div className="text-violet-600 font-medium bg-violet-50 dark:bg-violet-500/10 px-3 py-1 rounded-full text-sm">
                Active Plan
              </div>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, (user?.storageUsed / user?.storageLimit) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Security / Danger Zone */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Shield className="text-red-500" size={20} />
            Security & Access
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-2xl">
            <div>
              <div className="font-medium text-red-700 dark:text-red-400">Sign Out of Shnoor Cloud</div>
              <div className="text-sm text-red-600/70 dark:text-red-400/70 mt-0.5">Securely log out of this device.</div>
            </div>
            <button 
              onClick={logout}
              className="px-6 py-2.5 bg-white dark:bg-slate-800 text-red-600 border border-red-200 dark:border-red-500/30 hover:bg-red-50 hover:dark:bg-red-500/10 rounded-xl font-medium transition-colors shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
