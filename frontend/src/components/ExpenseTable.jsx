import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Edit3, Trash2, ArrowUpDown, CreditCard, Banknote, Landmark, Smartphone } from 'lucide-react';

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

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'CASH': return <Banknote size={14} />;
      case 'UPI': return <Smartphone size={14} />;
      case 'CREDIT_CARD':
      case 'DEBIT_CARD': return <CreditCard size={14} />;
      case 'BANK_TRANSFER': return <Landmark size={14} />;
      default: return null;
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No expense transactions found matching your criteria.</p>
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
          {expenses.map((item) => (
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
                <div style={styles.paymentBadge}>
                  {getPaymentIcon(item.paymentMethod)}
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
                    <Edit3 size={15} color="var(--primary)" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    style={{ ...styles.iconBtn, color: 'var(--danger)' }}
                    title="Delete Expense Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={styles.pagination}>
        <span style={styles.pageInfo}>
          Page <strong className="tabular-nums">{page + 1}</strong> of <strong className="tabular-nums">{totalPages || 1}</strong> ({totalElements} total entries)
        </span>
        <div style={styles.pageBtns}>
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="btn btn-secondary btn-sm"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="btn btn-secondary btn-sm"
          >
            Next
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
    fontSize: '0.75rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    cursor: 'pointer',
    userSelect: 'none',
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
    fontSize: '0.78rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
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
    padding: '8px',
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
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  pageBtns: {
    display: 'flex',
    gap: '8px',
  },
  emptyState: {
    padding: '50px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
};
