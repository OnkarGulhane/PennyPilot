import React, { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';
import { X } from 'lucide-react';

const CATEGORIES = [
  'FOOD', 'TRAVEL', 'SHOPPING', 'BILLS', 'ENTERTAINMENT',
  'HEALTH', 'EDUCATION', 'RENT', 'GROCERIES', 'OTHER'
];

const PAYMENT_METHODS = [
  'CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'OTHER'
];

export const ExpenseForm = ({ initialData, isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'FOOD',
    description: '',
    expenseDate: getTodayDateString(),
    paymentMethod: 'UPI',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        category: initialData.category || 'FOOD',
        description: initialData.description || '',
        expenseDate: initialData.expenseDate || getTodayDateString(),
        paymentMethod: initialData.paymentMethod || 'UPI',
      });
    } else {
      setFormData({
        amount: '',
        category: 'FOOD',
        description: '',
        expenseDate: getTodayDateString(),
        paymentMethod: 'UPI',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <div style={styles.overlay}>
      <div className="glass-card" style={styles.modal}>
        <div style={styles.header}>
          <h3>{initialData ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 450.00"
              className="form-control"
              required
            />
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Payment Method *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="form-control"
                required
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expense Date *</label>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes or remarks..."
              className="form-control"
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
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
    maxWidth: '500px',
    padding: '28px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '12px',
  },
};
