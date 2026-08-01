import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Copy, Check, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { format } from 'date-fns';

const TransactionTable = ({
  transactions,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  onStatusUpdate,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickStatusChange = async (customOrderId, newStatus) => {
    if (!onStatusUpdate) return;
    setUpdatingId(customOrderId);
    try {
      await onStatusUpdate(customOrderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 select-none">
              <th className="py-3.5 px-4 w-12 text-center">Sr.No</th>
              <th className="py-3.5 px-4">Institute / School</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Order ID (custom_order_id)</th>
              <th className="py-3.5 px-4">Collect ID</th>
              <th className="py-3.5 px-4 text-right">Order Amt</th>
              <th className="py-3.5 px-4 text-right">Trans Amt</th>
              <th className="py-3.5 px-4">Gateway / Method</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4 text-center">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td colSpan="11" className="py-4 px-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="11" className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-3xl">🔍</span>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No transactions found</p>
                    <p className="text-xs">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((item, index) => {
                const srNo = (page - 1) * 10 + index + 1;
                const formattedDate = item.createdAt
                  ? format(new Date(item.createdAt), 'dd/MM/yyyy, hh:mm:ss a')
                  : 'N/A';

                return (
                  <tr
                    key={item._id || item.custom_order_id}
                    className="table-row-hover bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-center text-slate-400 font-medium">
                      {srNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]" title={item.institute_name}>
                        {item.institute_name || 'ST. PATRICKS SENIOR SECONDARY SCHOOL'}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                        ID: {item.school_id}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs">
                      {formattedDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 px-2 py-1 rounded border border-slate-200/50 dark:border-slate-700/50 w-fit">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{item.custom_order_id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.custom_order_id);
                          }}
                          title="Copy Custom Order ID"
                          className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                        >
                          {copiedId === item.custom_order_id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={item.collect_id}>
                      {item.collect_id}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-800 dark:text-slate-200">
                      {formatCurrency(item.order_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.transaction_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{item.gateway}</div>
                      <div className="text-[11px] text-slate-400">{item.payment_method || 'Net Banking'}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.student_name || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.phone_no || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {updatingId === item.custom_order_id ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                        ) : (
                          <select
                            value={item.status}
                            onChange={(e) => handleQuickStatusChange(item.custom_order_id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="Success">Set Success</option>
                            <option value="Pending">Set Pending</option>
                            <option value="Failed">Set Failed</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-700/80">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{transactions.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(page * 10, total)}</span> of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span> transactions
        </div>

        <div className="flex items-center space-x-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = page - 3 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
