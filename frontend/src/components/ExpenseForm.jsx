import React, { useState, useEffect } from 'react';
import { getTodayDateString } from '../utils/date';
import {
  X, Utensils, Car, ShoppingBag, FileText, Film,
  HeartPulse, GraduationCap, Home, ShoppingCart, Tag,
  Banknote, Smartphone, CreditCard, Landmark, Calendar,
  PlusCircle, Sparkles, Check
} from 'lucide-react';

const CATEGORY_ITEMS = [
  { id: 'FOOD', label: 'Food', icon: Utensils, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { id: 'TRAVEL', label: 'Travel', icon: Car, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  { id: 'SHOPPING', label: 'Shopping', icon: ShoppingBag, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
  { id: 'BILLS', label: 'Bills', icon: FileText, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Film, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  { id: 'HEALTH', label: 'Health', icon: HeartPulse, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'EDUCATION', label: 'Education', icon: GraduationCap, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
  { id: 'RENT', label: 'Rent', icon: Home, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  { id: 'GROCERIES', label: 'Groceries', icon: ShoppingCart, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
  { id: 'OTHER', label: 'Other', icon: Tag, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
];

const PAYMENT_ITEMS = [
  { id: 'CASH', label: 'Cash', icon: Banknote },
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Landmark },
  { id: 'OTHER', label: 'Other', icon: Tag },
];

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000, 5000];

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
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
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

  const handlePresetClick = (addValue) => {
    const current = parseFloat(formData.amount) || 0;
    const updated = (current + addValue).toFixed(2);
    setFormData((prev) => ({ ...prev, amount: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount greater than ₹0');
      return;
    }
    onSubmit({
      ...formData,
      amount: numAmount,
      description: formData.description.trim(),
    });
  };

  const selectedCategoryObj = CATEGORY_ITEMS.find((c) => c.id === formData.category) || CATEGORY_ITEMS[0];

  return (
    <div style={styles.overlay} className="animate-backdrop">
      <div className="glass-panel modal-responsive animate-modal-pop" style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitleGroup}>
            <div style={{ ...styles.headerBadgeIcon, backgroundColor: selectedCategoryObj.bg, color: selectedCategoryObj.color }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={styles.title}>{initialData ? 'Edit Expense Entry' : 'Add New Expense'}</h3>
              <p style={styles.subtitle}>Record your financial transaction in PostgreSQL</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} title="Close Form">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Amount Hero Input Area */}
          <div style={styles.amountBox}>
            <label style={styles.amountLabel}>ENTER AMOUNT (₹)</label>
            <div style={styles.amountInputRow}>
              <span style={styles.currencySymbol}>₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                style={styles.amountInput}
                className="tabular-nums"
                required
                autoFocus
              />
            </div>

            {/* Quick Preset Amount Pills */}
            <div style={styles.presetRow}>
              <span style={styles.presetLabel}>Quick Add:</span>
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  style={styles.presetBtn}
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Category Selector Grid */}
          <div style={styles.section}>
            <label className="form-label">Select Category *</label>
            <div style={styles.categoryGrid}>
              {CATEGORY_ITEMS.map((item) => {
                const CategoryIcon = item.icon;
                const isSelected = formData.category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category: item.id }))}
                    style={{
                      ...styles.categoryCard,
                      ...(isSelected ? {
                        borderColor: item.color,
                        backgroundColor: item.bg,
                        boxShadow: `0 0 16px ${item.color}40`,
                      } : {}),
                    }}
                  >
                    <div style={{ color: item.color }}>
                      <CategoryIcon size={20} />
                    </div>
                    <span style={{ ...styles.categoryLabel, ...(isSelected ? { color: item.color, fontWeight: '700' } : {}) }}>
                      {item.label}
                    </span>
                    {isSelected && (
                      <div style={{ ...styles.checkCircle, backgroundColor: item.color }}>
                        <Check size={10} color="#ffffff" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Pills & Date */}
          <div style={styles.row} className="form-row-responsive">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Payment Method *</label>
              <div style={styles.paymentPillsGrid}>
                {PAYMENT_ITEMS.map((item) => {
                  const PayIcon = item.icon;
                  const isSelected = formData.paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: item.id }))}
                      style={{
                        ...styles.paymentPill,
                        ...(isSelected ? styles.paymentPillActive : {}),
                      }}
                    >
                      <PayIcon size={14} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expense Date & Notes */}
          <div style={styles.row} className="form-row-responsive">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Expense Date *</label>
              <div style={styles.inputWithIcon}>
                <Calendar size={16} style={styles.fieldIcon} />
                <input
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleChange}
                  className="form-control-pro"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Description / Remarks (Optional)</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Dinner at restaurant, Grocery refill, etc."
                className="form-control-pro"
                maxLength="500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <PlusCircle size={18} />
              <span>{loading ? 'Saving Entry...' : initialData ? 'Update Expense' : 'Save Expense'}</span>
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 120,
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '28px',
    borderRadius: '24px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)',
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerBadgeIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  closeBtn: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  amountBox: {
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  amountLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
  },
  amountInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  currencySymbol: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--primary)',
    fontFamily: 'var(--font-display)',
  },
  amountInput: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '2.25rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  presetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  presetLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  presetBtn: {
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: '700',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '10px',
  },
  categoryCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  categoryLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  checkCircle: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  paymentPillsGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  paymentPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  paymentPillActive: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    fontWeight: '700',
  },
  inputWithIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fieldIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
};
