import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';

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

  if (!expenses || expenses.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>No expenses found. Click "Add Expense" to record your first transaction.</p>
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
                <span>Date</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Payment Method</th>
            <th style={styles.th} onClick={() => onSortChange && onSortChange('amount')}>
              <div style={styles.thContent}>
                <span>Amount</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((item) => (
            <tr key={item.id} style={styles.tr}>
              <td style={styles.td}>{formatDate(item.expenseDate)}</td>
              <td style={styles.td}>
                <span className={`badge ${getCategoryBadgeClass(item.category)}`}>
                  {item.category}
                </span>
              </td>
              <td style={styles.td}>{item.description || '—'}</td>
              <td style={styles.td}>
                <span style={styles.paymentBadge}>{item.paymentMethod.replace('_', ' ')}</span>
              </td>
              <td style={{ ...styles.td, fontWeight: '700', color: 'var(--text-primary)' }}>
                {formatCurrency(item.amount)}
              </td>
              <td style={{ ...styles.td, textAlign: 'right' }}>
                <div style={styles.actions}>
                  <button
                    onClick={() => onEdit && onEdit(item)}
                    style={styles.iconBtn}
                    title="Edit Expense"
                  >
                    <Edit2 size={16} color="var(--primary)" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item)}
                    style={{ ...styles.iconBtn, color: 'var(--danger)' }}
                    title="Delete Expense"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div style={styles.pagination}>
        <span style={styles.pageInfo}>
          Showing page <strong>{page + 1}</strong> of <strong>{totalPages || 1}</strong> ({totalElements} total)
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
    padding: '14px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
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
    padding: '14px 16px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  paymentBadge: {
    fontSize: '0.78rem',
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    transition: 'var(--transition)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderTop: '1px solid var(--border-color)',
  },
  pageInfo: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  pageBtns: {
    display: 'flex',
    gap: '8px',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
};
