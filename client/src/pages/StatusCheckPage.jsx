import React, { useState } from 'react';
import { checkTransactionStatus } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Search, ShieldCheck, Clock, Building2, User, CreditCard, AlertCircle, Copy, Check } from 'lucide-react';
import { format } from 'date-fns';

const StatusCheckPage = () => {
  const [customOrderId, setCustomOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!customOrderId.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await checkTransactionStatus(customOrderId.trim());
      if (res.success) {
        setResult(res.data || res);
      }
    } catch (err) {
      setError(err.response?.data?.message || `No transaction record found matching '${customOrderId}'`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl mb-2">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Transaction Status Check
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter any <span className="font-mono text-blue-600 dark:text-blue-400">custom_order_id</span> or <span className="font-mono text-blue-600 dark:text-blue-400">collect_id</span> to verify transaction status and payment bank references.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              placeholder="e.g. 608A17340625700001 or collect_id"
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customOrderId.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            {loading ? (
              <span>Checking...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Check Status</span>
              </>
            )}
          </button>
        </div>

        {/* Preset quick test buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
          <span>Try quick sample:</span>
          {['608A17340625700001', '608A17340625700005', '608A17340625700055'].map((sampleId) => (
            <button
              key={sampleId}
              type="button"
              onClick={() => {
                setCustomOrderId(sampleId);
              }}
              className="px-2.5 py-1 font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              {sampleId}
            </button>
          ))}
        </div>
      </form>

      {/* Error View */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-2xl flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden animate-fadeIn">
          {/* Status Header Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Custom Order ID</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <h3 className="text-xl font-mono font-bold">{result.custom_order_id}</h3>
                <button
                  onClick={() => handleCopy(result.custom_order_id)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <StatusBadge status={result.status} />
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400">Institute / School</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {result.institute_name || 'ST. PATRICKS SENIOR SECONDARY SCHOOL'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">ID: {result.school_id}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400">Student Info</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {result.student_name || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">Phone: {result.phone_no || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400">Created Timestamp</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                    {result.createdAt ? format(new Date(result.createdAt), 'PPP, hh:mm:ss a') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Collect ID</span>
                <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{result.collect_id}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Order Amount</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{result.order_amount}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Paid Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">₹{result.transaction_amount}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Payment Gateway</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{result.gateway}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Bank Reference</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {result.bank_reference || 'NA'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheckPage;
