import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, CreditCard, ShieldCheck, User, LogOut, Lock, Settings, Server, ExternalLink } from 'lucide-react';
import { loginApi } from '../services/api';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loginUser, logoutUser, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('admin123');
  const [customBackendUrl, setCustomBackendUrl] = useState(
    localStorage.getItem('api_base_url') || ''
  );
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        loginUser(res.token, res.user);
        setShowLoginModal(false);
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.message ||
          'Connection failed. Please click the ⚙️ Settings icon in the top right to verify your Render Backend URL.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const saveBackendUrl = (e) => {
    e.preventDefault();
    if (customBackendUrl.trim()) {
      let formatted = customBackendUrl.trim();
      if (!formatted.endsWith('/api')) {
        formatted = formatted.replace(/\/$/, '') + '/api';
      }
      localStorage.setItem('api_base_url', formatted);
      setCustomBackendUrl(formatted);
      setShowSettings(false);
      window.location.reload();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20 text-white">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  Edviron
                </span>
                <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  Payments Dashboard
                </span>
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3">
              {/* Backend Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                aria-label="API Settings"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                title="Configure Render Backend URL"
              >
                <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Backend URL</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark/Light Mode"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
              </button>

              {/* JWT Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Admin'}</span>
                    <span className="text-[10px] text-emerald-500 font-medium">JWT Secured</span>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="p-2 rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>JWT Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backend API Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700 mb-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Set Render Backend URL</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Copy your Render Backend Service URL from your Render dashboard (e.g. <span className="font-mono text-blue-600 dark:text-blue-400">https://your-service-name.onrender.com</span>) and paste it below:
            </p>

            <form onSubmit={saveBackendUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Render Service URL
                </label>
                <input
                  type="text"
                  value={customBackendUrl}
                  onChange={(e) => setCustomBackendUrl(e.target.value)}
                  placeholder="https://school-payment-backend-xxxx.onrender.com"
                  required
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('api_base_url');
                    setCustomBackendUrl('');
                  }}
                  className="px-3 py-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl font-medium"
                >
                  Clear Saved URL
                </button>
                <button type="submit" className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
                  Save Backend URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-700 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">JWT Admin Login</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl text-xs space-y-1">
                <p className="font-semibold">{loginError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowSettings(true);
                  }}
                  className="text-blue-600 dark:text-blue-400 underline font-bold"
                >
                  ⚙️ Open Backend Settings
                </button>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 p-2.5 rounded-lg">
                💡 Demo Credentials: <span className="font-mono text-blue-600 dark:text-blue-400">admin@school.com</span> / <span className="font-mono text-blue-600 dark:text-blue-400">admin123</span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
