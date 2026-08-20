import React, { useState, useEffect } from 'react';
import { budgetApi } from '../api/budgetApi';
import { BudgetCard } from '../components/BudgetCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { Plus, Wallet, Trash2, Edit3, Target } from 'lucide-react';
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

  if (loading) return <Loading text="Loading Budget Planning Module..." />;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader} className="page-header-responsive">
        <div>
          <div style={styles.headerBadge}>
            <Wallet size={16} color="var(--emerald)" />
            <span>BUDGET PLANNING & GOALS</span>
          </div>
          <h1 style={styles.pageTitle}>Monthly Target Budgets</h1>
          <p style={styles.pageSubtitle}>Define target spending caps and monitor utilization limits</p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} />
          <span>Set Target Budget</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchBudgets} />

      {/* Budgets Grid */}
      <div style={styles.budgetGrid} className="grid-responsive-2col">
        {budgets.map((b) => (
          <div key={b.id} style={styles.cardWrapper}>
            <BudgetCard budget={b} />
            <div style={styles.cardActions}>
              <button onClick={() => handleOpenEdit(b)} style={styles.actionBtn}>
                <Edit3 size={15} color="var(--primary)" />
                <span>Modify Target</span>
              </button>
              <button onClick={() => setDeletingBudget(b)} style={{ ...styles.actionBtn, color: 'var(--danger)' }}>
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {budgets.length === 0 && (
          <div className="glass-panel" style={styles.emptyCard}>
            <Target size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
            <h3>No Active Budget Targets</h3>
            <p style={{ marginTop: '6px', color: 'var(--text-muted)' }}>
              Click "Set Target Budget" above to create a monthly spending cap limit.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.overlay}>
          <div className="glass-panel" style={styles.modal}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>
              {editingBudget ? 'Edit Target Budget' : 'Configure Monthly Budget'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="form-control-pro"
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
                    className="form-control-pro"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Limit Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 20000.00"
                  className="form-control-pro"
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : editingBudget ? 'Update Target' : 'Save Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deletingBudget}
        title="Delete Target Budget"
        message={`Are you sure you want to remove the target budget for ${formatMonthYear(`${deletingBudget?.year}-${String(deletingBudget?.month).padStart(2, '0')}`)}?`}
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
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--emerald)',
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
    fontSize: '0.825rem',
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
    backdropFilter: 'blur(6px)',
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
