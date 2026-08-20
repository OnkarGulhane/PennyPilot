import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Edit3, Trash2, ArrowUpDown, CreditCard, Banknote, Landmark, Smartphone, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExpenseTable = ({
  expenses,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
}) => {
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'FOOD': return 'badge-food';
      case 'TRAVEL': return 'badge-travel';
      case 'SHOPPING': return 'badge-shopping';
      case 'BILLS': return 'badge-bills';
      case 'ENTERTAINMENT': return 'badge-entertainment';
      case 'HEALTH': return 'badge-health';
      case 'EDUCATION': return 'badge-education';
      case 'RENT': return 'badge-rent';
      case 'GROCERIES': return 'badge-groceries';
      default: return 'badge-other';
    }
  };

  const getPaymentStyle = (method) => {
    switch (method) {
      case 'UPI':
        return { bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)', icon: Smartphone };
      case 'CASH':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)', icon: Banknote };
      case 'CREDIT_CARD':
        return { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.3)', icon: CreditCard };
      case 'DEBIT_CARD':
        return { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)', icon: CreditCard };
      case 'BANK_TRANSFER':
        return { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)', icon: Landmark };
      default:
        return { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)', icon: CreditCard };
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIconBadge}>
          <Receipt size={32} color="var(--primary)" />
        </div>
        <h4 style={styles.emptyTitle}>No Expenses Recorded</h4>
        <p style={styles.emptySubtitle}>
          There are no expense transactions matching your selected filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th} onClick={() => onSortChange && onSortChange('expenseDate')}>
              <div style={styles.thContent}>
                <span>DATE</span>
                <ArrowUpDown size={13} color="var(--primary)" />
              </div>
            </th>
            <th style={styles.th}>CATEGORY</th>
            <th style={styles.th}>DESCRIPTION</th>
            <th style={styles.th}>PAYMENT METHOD</th>
            <th style={styles.th} onClick={() => onSortChange && onSortChange('amount')}>
              <div style={styles.thContent}>
                <span>AMOUNT</span>
                <ArrowUpDown size={13} color="var(--primary)" />
              </div>
            </th>
            <th style={{ ...styles.th, textAlign: 'right' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((item) => {
            const payObj = getPaymentStyle(item.paymentMethod);
            const PayIcon = payObj.icon;

            return (
              <tr key={item.id} style={styles.tr} className="hover-row">
                <td style={styles.td} className="tabular-nums">{formatDate(item.expenseDate)}</td>
                <td style={styles.td}>
                  <span className={`dot-badge ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td style={{ ...styles.td, color: 'var(--text-primary)', fontWeight: '500' }}>
                  {item.description || '—'}
                </td>
                <td style={styles.td}>
                  <div
                    style={{
                      ...styles.paymentBadge,
                      backgroundColor: payObj.bg,
                      color: payObj.color,
                      borderColor: payObj.border,
                    }}
                  >
                    <PayIcon size={13} />
                    <span>{item.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </td>
                <td style={{ ...styles.td, fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.95rem' }} className="tabular-nums">
                  {formatCurrency(item.amount)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => onEdit && onEdit(item)}
                      style={styles.iconBtn}
                      title="Edit Expense Entry"
                    >
                      <Edit3 size={14} color="var(--primary)" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(item)}
                      style={{ ...styles.iconBtn, color: 'var(--danger)' }}
                      title="Delete Expense Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Bar */}
      <div style={styles.pagination}>
        <span style={styles.pageInfo}>
          Page <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{page + 1}</strong> of <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{totalPages || 1}</strong> ({totalElements} entries)
        </span>
        <div style={styles.pageBtns}>
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="btn btn-secondary btn-sm"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '16px 20px',
    fontSize: '0.725rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    cursor: 'pointer',
    userSelect: 'none',
    fontFamily: 'var(--font-display)',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'var(--transition)',
  },
  td: {
    padding: '16px 20px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  paymentBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid transparent',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  iconBtn: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    padding: '7px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid var(--border-color)',
  },
  pageInfo: {
    fontSize: '0.825rem',
    color: 'var(--text-secondary)',
  },
  pageBtns: {
    display: 'flex',
    gap: '8px',
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBadge: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginTop: '6px',
    maxWidth: '400px',
  },
};
