import React, { useState, useEffect, useCallback } from 'react';
import { fetchDistinctSchools, fetchSchoolTransactions, updateTransactionStatus } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import { Building2, Search, Filter, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

const SchoolTransactionsPage = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Load distinct schools list for dropdown
  useEffect(() => {
    const loadSchools = async () => {
      try {
        const res = await fetchDistinctSchools();
        if (res.success && res.data.length > 0) {
          setSchools(res.data);
          setSelectedSchool(res.data[0].school_id);
        }
      } catch (err) {
        console.error('Error fetching schools:', err);
      }
    };
    loadSchools();
  }, []);

  const loadSchoolData = useCallback(async () => {
    if (!selectedSchool) return;
    setLoading(true);
    try {
      const res = await fetchSchoolTransactions(selectedSchool, {
        page,
        limit: 10,
        status: statusFilter,
        search,
      });

      if (res.success) {
        setTransactions(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Error fetching school transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSchool, page, statusFilter, search]);

  useEffect(() => {
    loadSchoolData();
  }, [loadSchoolData]);

  const handleStatusUpdate = async (custom_order_id, newStatus) => {
    try {
      await updateTransactionStatus({ custom_order_id, status: newStatus });
      await loadSchoolData();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const currentSchoolInfo = schools.find((s) => s.school_id === selectedSchool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Transactions Details by School</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select a school to view filtered ledger records and status breakdowns.
        </p>
      </div>

      {/* School Selector Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select School / Institute ID
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <select
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
            >
              {schools.map((sch) => (
                <option key={sch.school_id} value={sch.school_id}>
                  {sch.institute_name} ({sch.school_id}) - {sch.total_transactions} txns
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Filter by school_id directly..."
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 font-mono"
            />
          </div>
        </div>

        {/* Selected School Overview Pill */}
        {currentSchoolInfo && (
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500">School Name</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                {currentSchoolInfo.institute_name}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500">Total School Records</span>
              <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                {currentSchoolInfo.total_transactions} transactions
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500">Total School Revenue</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                ₹{currentSchoolInfo.total_revenue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar for School Transactions */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search within this school..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(p) => setPage(p)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default SchoolTransactionsPage;
