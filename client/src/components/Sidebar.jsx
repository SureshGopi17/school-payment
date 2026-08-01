import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Search,
  Webhook,
  PlusCircle,
  BarChart3,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/school-transactions', label: 'By School', icon: Building2 },
    { path: '/check-status', label: 'Check Status', icon: Search },
    { path: '/webhook-tester', label: 'Webhook & Updates', icon: Webhook },
    { path: '/create-payment', label: 'Create Collect', icon: PlusCircle },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200/80 dark:border-slate-800 p-4 transition-colors flex md:flex-col justify-between shrink-0">
      <div className="w-full">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3 hidden md:block">
          Navigation Menu
        </div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Database Connection Info Banner */}
      <div className="hidden md:block mt-8 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>MongoDB Live</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          Connected to assessment dataset. REST endpoints active.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
