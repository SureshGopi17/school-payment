import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import OverviewPage from './pages/OverviewPage';
import SchoolTransactionsPage from './pages/SchoolTransactionsPage';
import StatusCheckPage from './pages/StatusCheckPage';
import WebhookPage from './pages/WebhookPage';
import CreatePaymentPage from './pages/CreatePaymentPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        <Sidebar />

        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
            <Route path="/check-status" element={<StatusCheckPage />} />
            <Route path="/webhook-tester" element={<WebhookPage />} />
            <Route path="/create-payment" element={<CreatePaymentPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Full Stack School Payment & Dashboard Application • Powered by React.js & Express</p>
      </footer>
    </div>
  );
}

export default App;
