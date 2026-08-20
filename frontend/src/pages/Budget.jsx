import React, { useState, useEffect } from 'react';
import { budgetApi } from '../api/budgetApi';
import { BudgetCard } from '../components/BudgetCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, Wallet, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { formatMonthYear } from '../utils/date';

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const [formData, setFormData] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    amount: '',
  });

  const fetchBudgets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await budgetApi.getBudgets();
      setBudgets(response || []);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenCreate = () => {
    setEditingBudget(null);
    setFormData({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBudget(b);
    setFormData({
      month: b.month,
      year: b.year,
      amount: b.amount,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        amount: parseFloat(formData.amount),
      };

      if (editingBudget) {
        await budgetApi.updateBudget(editingBudget.id, payload);
      } else {
        await budgetApi.createBudget(payload);
      }

      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      alert(err.message || 'Failed to save budget target');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBudget) return;
    setSubmitting(true);
    try {
      await budgetApi.deleteBudget(deletingBudget.id);
      setDeletingBudget(null);
      fetchBudgets();
    } catch (err) {
      alert(err.message || 'Failed to delete budget');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading Monthly Budgets..." />;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Monthly Budgets</h1>
          <p style={styles.pageSubtitle}>Set monthly spending limits and monitor budget utilization</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Set Budget</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchBudgets} />

      {/* Budgets Grid */}
      <div style={styles.budgetGrid}>
        {budgets.map((b) => (
          <div key={b.id} style={styles.cardWrapper}>
            <BudgetCard budget={b} />
            <div style={styles.cardActions}>
              <button onClick={() => handleOpenEdit(b)} style={styles.actionBtn}>
                <Edit2 size={16} color="var(--primary)" />
                <span>Edit Target</span>
              </button>
              <button onClick={() => setDeletingBudget(b)} style={{ ...styles.actionBtn, color: 'var(--danger)' }}>
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="glass-card" style={styles.emptyCard}>
            <Wallet size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3>No Monthly Budgets Configured</h3>
            <p style={{ marginTop: '6px', color: 'var(--text-muted)' }}>
              Click "Set Budget" to define a target spending limit for any month.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div className="glass-card" style={styles.modal}>
            <h3 style={{ marginBottom: '20px' }}>
              {editingBudget ? 'Edit Monthly Budget' : 'Set New Monthly Budget'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Month (1-12)</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="form-control"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {new Date(2026, m - 1, 1).toLocaleString('en', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Budget Limit Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 20000.00"
                  className="form-control"
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingBudget ? 'Update Budget' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingBudget}
        title="Delete Monthly Budget"
        message={`Are you sure you want to delete the budget limit for ${formatMonthYear(`${deletingBudget?.year}-${String(deletingBudget?.month).padStart(2, '0')}`)}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBudget(null)}
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
  budgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
  },
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '0 4px',
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  emptyCard: {
    gridColumn: '1 / -1',
    padding: '60px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '460px',
    padding: '28px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
};
