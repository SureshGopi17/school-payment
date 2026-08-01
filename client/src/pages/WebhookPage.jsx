import React, { useState } from 'react';
import { sendWebhookPayload, updateTransactionStatus } from '../services/api';
import { Webhook, Send, Edit3, CheckCircle2, AlertCircle, RefreshCw, Code, Terminal } from 'lucide-react';

const WebhookPage = () => {
  const [activeTab, setActiveTab] = useState('webhook');

  // Webhook Tab State
  const [jsonPayload, setJsonPayload] = useState(
    JSON.stringify(
      {
        status: 200,
        order_info: {
          order_id: '608A17340625700001',
          order_amount: 2000,
          transaction_amount: 2200,
          gateway: 'PhonePe',
          bank_reference: 'YESBNK222',
        },
      },
      null,
      2
    )
  );

  const [webhookResponse, setWebhookResponse] = useState(null);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [webhookError, setWebhookError] = useState('');

  // Manual Update Tab State
  const [manualOrderId, setManualOrderId] = useState('608A17340625700001');
  const [manualStatus, setManualStatus] = useState('Success');
  const [bankRef, setBankRef] = useState('YESBNK333');
  const [manualResponse, setManualResponse] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState('');

  const handleSendWebhook = async (e) => {
    e?.preventDefault();
    setWebhookLoading(true);
    setWebhookError('');
    setWebhookResponse(null);

    try {
      const parsed = JSON.parse(jsonPayload);
      const res = await sendWebhookPayload(parsed);
      setWebhookResponse(res);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setWebhookError('Invalid JSON format in payload text area.');
      } else {
        setWebhookError(err.response?.data?.message || 'Failed to trigger webhook payload.');
      }
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleManualUpdate = async (e) => {
    e?.preventDefault();
    if (!manualOrderId.trim()) return;

    setManualLoading(true);
    setManualError('');
    setManualResponse(null);

    try {
      const res = await updateTransactionStatus({
        custom_order_id: manualOrderId.trim(),
        status: manualStatus,
        bank_reference: bankRef,
      });
      setManualResponse(res);
    } catch (err) {
      setManualError(err.response?.data?.message || 'Failed to update transaction status.');
    } finally {
      setManualLoading(false);
    }
  };

  const setPresetWebhook = (status, orderId, gateway, bankRef) => {
    const payload = {
      status: status,
      order_info: {
        order_id: orderId,
        order_amount: 2500,
        transaction_amount: status === 200 ? 2500 : 0,
        gateway: gateway,
        bank_reference: bankRef,
      },
    };
    setJsonPayload(JSON.stringify(payload, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Webhook className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Webhook & Manual Status Updates</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Test real-time status update webhooks or manually override transaction states.
        </p>
      </div>

      {/* Tab Nav Buttons */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 space-x-4">
        <button
          onClick={() => setActiveTab('webhook')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'webhook'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>iv) Webhook Payload Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'manual'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>v) Manual Status Update</span>
        </button>
      </div>

      {/* TAB 1: WEBHOOK SIMULATOR */}
      {activeTab === 'webhook' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                JSON Webhook Payload
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-slate-500">
                POST /api/webhook
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPresetWebhook(200, '608A17340625700001', 'PhonePe', 'YESBNK222')}
                className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Preset: Success 200
              </button>

              <button
                type="button"
                onClick={() => setPresetWebhook(400, '608A17340625700002', 'PayTM', 'FAILREF999')}
                className="px-2.5 py-1 text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded-lg hover:bg-rose-100 transition-colors"
              >
                Preset: Failed 400
              </button>
            </div>

            <textarea
              rows={12}
              value={jsonPayload}
              onChange={(e) => setJsonPayload(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 border-0"
            />

            <button
              onClick={handleSendWebhook}
              disabled={webhookLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {webhookLoading ? (
                <span>Dispatching Webhook...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Webhook Payload</span>
                </>
              )}
            </button>

            {webhookError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200">
                {webhookError}
              </div>
            )}
          </div>

          {/* Webhook Response Panel */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 text-slate-100 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Server Response Terminal
                </span>
                <span>STATUS</span>
              </div>

              {webhookResponse ? (
                <pre className="mt-4 p-3 bg-slate-950 rounded-xl overflow-x-auto text-emerald-400 text-[11px] leading-relaxed">
                  {JSON.stringify(webhookResponse, null, 2)}
                </pre>
              ) : (
                <div className="py-20 text-center text-slate-600 text-xs font-sans">
                  Click <span className="text-indigo-400 font-semibold">"Send Webhook Payload"</span> to inspect HTTP 200 response and DB mutation logs.
                </div>
              )}
            </div>

            {webhookResponse && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-sans text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transaction {webhookResponse?.data?.order_id} status updated to {webhookResponse?.data?.status}!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL STATUS UPDATE */}
      {activeTab === 'manual' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-6">
          <form onSubmit={handleManualUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Order ID (or collect_id)
              </label>
              <input
                type="text"
                value={manualOrderId}
                onChange={(e) => setManualOrderId(e.target.value)}
                placeholder="e.g. 608A17340625700001"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Status
                </label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100"
                >
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Reference Code
                </label>
                <input
                  type="text"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  placeholder="e.g. YESBNK333"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={manualLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              {manualLoading ? (
                <span>Updating Status...</span>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Update Transaction Status</span>
                </>
              )}
            </button>
          </form>

          {manualError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
              {manualError}
            </div>
          )}

          {manualResponse && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-xl space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{manualResponse.message}</span>
              </div>
              <pre className="p-3 bg-white dark:bg-slate-900 rounded-lg text-[11px] font-mono overflow-x-auto">
                {JSON.stringify(manualResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebhookPage;
