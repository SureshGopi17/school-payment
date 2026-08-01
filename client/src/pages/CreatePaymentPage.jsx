import React, { useState } from 'react';
import { createCollectPaymentRequest } from '../services/api';
import { CreditCard, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const CreatePaymentPage = () => {
  const [schoolId, setSchoolId] = useState('65b0e6293e9f76a9694d84b4');
  const [amount, setAmount] = useState('2500');
  const [studentName, setStudentName] = useState('Rohan Mehta');
  const [gateway, setGateway] = useState('PhonePe');
  const [customOrderId, setCustomOrderId] = useState(`ORD_${Date.now().toString().slice(-6)}`);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await createCollectPaymentRequest({
        school_id: schoolId,
        amount: Number(amount),
        student_name: studentName,
        gateway: gateway,
        custom_order_id: customOrderId,
      });

      if (res.success) {
        setResponse(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create collect request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Additional Task Feature
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Edviron Payment Collect Request</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Initiate payment requests via Edviron ERP API integration & store transaction ledger records.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              School ID
            </label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Order ID
            </label>
            <input
              type="text"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Gateway
            </label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
            >
              <option value="PhonePe">PhonePe</option>
              <option value="Razorpay">Razorpay</option>
              <option value="PayTM">PayTM</option>
              <option value="EDVIRON">EDVIRON PG</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Generating Collect Link...</span>
          ) : (
            <>
              <span>Create Payment Link & Save Record</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-4 animate-fadeIn">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Collect Payment Link Created & Saved in DB!</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200/60 dark:border-emerald-900 space-y-2">
            <span className="text-[11px] text-slate-500">Payment Link URL</span>
            <div className="flex items-center justify-between gap-2">
              <a
                href={response.payment_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold hover:underline truncate"
              >
                {response.payment_url}
              </a>
              <a
                href={response.payment_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 shrink-0"
              >
                <span>Pay Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="text-xs text-emerald-900 dark:text-emerald-200">
            Created transaction <span className="font-mono font-bold">{response.transaction?.custom_order_id}</span> with initial status <span className="font-bold text-amber-600">Pending</span>.
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePaymentPage;
