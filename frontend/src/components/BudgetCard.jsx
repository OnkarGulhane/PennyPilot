import React from 'react';
import { formatCurrency } from '../utils/currency';
import { AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const BudgetCard = ({ budget }) => {
  if (!budget) {
    return (
      <div className="glass-card" style={styles.card}>
        <div style={styles.emptyHeader}>
          <h3>No Monthly Budget Configured</h3>
          <p>Set a target budget for this month to monitor your spending limit.</p>
        </div>
      </div>
    );
  }

  const { amount, totalSpent, remainingAmount, usagePercentage, budgetExceeded } = budget;

  let statusClass = 'progress-success';
  let badgeStyle = { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
  let statusText = 'Within Budget';
  let StatusIcon = CheckCircle;

  if (budgetExceeded) {
    statusClass = 'progress-danger';
    badgeStyle = { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
    statusText = 'Budget Exceeded!';
    StatusIcon = Flame;
  } else if (usagePercentage >= 80) {
    statusClass = 'progress-warning';
    badgeStyle = { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
    statusText = 'Near Limit (80%+)';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.subtitle}>Current Month Budget</span>
          <h3 style={styles.title}>{formatCurrency(amount)}</h3>
        </div>
        <span style={{ ...styles.badge, ...badgeStyle }}>
          <StatusIcon size={14} />
          <span>{statusText}</span>
        </span>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressLabels}>
          <span>Spent: <strong>{formatCurrency(totalSpent)}</strong> ({usagePercentage}%)</span>
          <span>Remaining: <strong>{formatCurrency(remainingAmount)}</strong></span>
        </div>
        <div className="progress-container">
          <div
            className={`progress-bar ${statusClass}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  title: {
    fontSize: '1.75rem',
    color: 'var(--text-primary)',
    marginTop: '4px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  emptyHeader: {
    textAlign: 'center',
    padding: '12px',
    color: 'var(--text-muted)',
  },
};
