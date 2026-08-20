import React, { useState, useEffect } from 'react';
import { expenseApi } from '../api/expenseApi';
import { ExpenseTable } from '../components/ExpenseTable';
import { ExpenseForm } from '../components/ExpenseForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, Filter, RotateCcw, Search } from 'lucide-react';

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

  // Filters State
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

  // Modal States
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
      setError(err.message || 'Failed to load expenses list');
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
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Expenses</h1>
          <p style={styles.pageSubtitle}>Track, filter, and manage your daily transactions</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchExpenses} />

      {/* Filter Bar */}
      <form onSubmit={handleApplyFilters} className="glass-card" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Payment Method</label>
            <select
              name="paymentMethod"
              value={filters.paymentMethod}
              onChange={handleFilterChange}
              className="form-control"
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
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="form-control"
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

      {/* Expense Data Table Card */}
      <div className="glass-card" style={styles.tableCard}>
        {loading ? (
          <Loading text="Fetching expenses..." />
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

      {/* Add Expense Form Modal */}
      <ExpenseForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

      {/* Edit Expense Form Modal */}
      <ExpenseForm
        isOpen={!!editingExpense}
        initialData={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleUpdateExpense}
        loading={submitting}
      />

      {/* Delete Confirmation Modal */}
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
  pageTitle: {
    fontSize: '1.75rem',
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
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
