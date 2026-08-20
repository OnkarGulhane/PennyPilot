import React, { useState, useEffect } from 'react';
import { expenseApi } from '../api/expenseApi';
import { ExpenseTable } from '../components/ExpenseTable';
import { ExpenseForm } from '../components/ExpenseForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, Filter, RotateCcw, Search, Receipt } from 'lucide-react';

const CATEGORIES = [
  'FOOD', 'TRAVEL', 'SHOPPING', 'BILLS', 'ENTERTAINMENT',
  'HEALTH', 'EDUCATION', 'RENT', 'GROCERIES', 'OTHER'
];

const PAYMENT_METHODS = [
  'CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'OTHER'
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState('expenseDate,desc');

  const [filters, setFilters] = useState({
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size: pageSize,
        sort,
      };

      if (filters.category) params.category = filters.category;
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;

      const response = await expenseApi.getExpenses(params);
      setExpenses(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, pageSize, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickCategorySelect = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? '' : cat,
    }));
    setPage(0);
    fetchExpenses();
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(0);
    fetchExpenses();
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
    setPage(0);
    fetchExpenses();
  };

  const handleSortChange = (field) => {
    if (sort.startsWith(field)) {
      setSort(sort.endsWith('asc') ? `${field},desc` : `${field},asc`);
    } else {
      setSort(`${field},desc`);
    }
  };

  const handleCreateExpense = async (data) => {
    setSubmitting(true);
    try {
      await expenseApi.createExpense(data);
      setIsAddOpen(false);
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateExpense = async (data) => {
    if (!editingExpense) return;
    setSubmitting(true);
    try {
      await expenseApi.updateExpense(editingExpense.id, data);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to update expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) return;
    setSubmitting(true);
    try {
      await expenseApi.deleteExpense(deletingExpense.id);
      setDeletingExpense(null);
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader} className="page-header-responsive">
        <div>
          <div style={styles.headerBadge}>
            <Receipt size={16} color="var(--primary)" />
            <span>TRANSACTION MANAGEMENT</span>
          </div>
          <h1 style={styles.pageTitle}>Expenses Directory</h1>
          <p style={styles.pageSubtitle}>Search, filter, and audit your daily financial records</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>New Expense</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchExpenses} />

      {/* Quick Category Filter Pills */}
      <div style={styles.categoryPillsRow}>
        <button
          onClick={() => handleQuickCategorySelect('')}
          style={{
            ...styles.pillBtn,
            ...(filters.category === '' ? styles.pillBtnActive : {}),
          }}
        >
          All Categories
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => handleQuickCategorySelect(c)}
            style={{
              ...styles.pillBtn,
              ...(filters.category === c ? styles.pillBtnActive : {}),
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Advanced Filter Bar */}
      <form onSubmit={handleApplyFilters} className="glass-panel" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Payment Method</label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="form-control-pro"
            >
              <option value="">All Payment Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">From Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="form-control-pro"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="form-control-pro"
            />
          </div>
        </div>

        <div style={styles.filterActions}>
          <button type="submit" className="btn btn-primary btn-sm">
            <Filter size={14} />
            <span>Apply Filters</span>
          </button>
          <button type="button" onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </form>

      {/* Expense Data Table Container */}
      <div className="glass-panel" style={styles.tableCard}>
        {loading ? (
          <Loading text="Loading expenses list..." />
        ) : (
          <ExpenseTable
            expenses={expenses}
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={(newPage) => setPage(newPage)}
            onSortChange={handleSortChange}
            onEdit={(item) => setEditingExpense(item)}
            onDelete={(item) => setDeletingExpense(item)}
          />
        )}
      </div>

      {/* Modals */}
      <ExpenseForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

      <ExpenseForm
        isOpen={!!editingExpense}
        initialData={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleUpdateExpense}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deletingExpense}
        title="Delete Expense Entry"
        message={`Are you sure you want to delete this expense of ₹${deletingExpense?.amount}?`}
        onConfirm={handleDeleteExpense}
        onCancel={() => setDeletingExpense(null)}
        loading={submitting}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--primary)',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  pageTitle: {
    fontSize: '1.85rem',
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  categoryPillsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  pillBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    borderRadius: '9999px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'var(--transition)',
  },
  pillBtnActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    boxShadow: 'var(--shadow-glow)',
  },
  filterCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  filterActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  tableCard: {
    padding: '4px',
  },
};
