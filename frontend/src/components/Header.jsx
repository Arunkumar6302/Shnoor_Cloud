import { Search, Bell, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract initial search from URL
  const queryParam = new URLSearchParams(location.search).get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const handleNewNotification = (e) => {
      setNotifications(prev => [e.detail, ...prev].slice(0, 5));
      setHasUnread(true);
    };

    window.addEventListener('app_notification', handleNewNotification);
    return () => window.removeEventListener('app_notification', handleNewNotification);
  }, []);

  useEffect(() => {
    setSearchTerm(new URLSearchParams(location.search).get('q') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const searchParams = new URLSearchParams(location.search);
    if (value) {
      searchParams.set('q', value);
    } else {
      searchParams.delete('q');
    }
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    }, { replace: true });
  };

  return (
    <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 mr-2 lg:hidden">
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500 tracking-tight whitespace-nowrap">
            Shnoor Cloud
          </span>
        </div>
        
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
            className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:text-slate-200 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm italic">
                    No recent activity
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.body}</p>
                      <p className="text-[10px] text-slate-400 mt-2 italic">
                        {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => setNotifications([])} className="text-xs text-blue-600 font-medium hover:underline">Clear all</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
          <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 text-white font-medium text-sm flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
