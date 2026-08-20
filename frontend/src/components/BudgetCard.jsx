import React from 'react';
import { formatCurrency } from '../utils/currency';
import { AlertTriangle, CheckCircle2, Flame, Target } from 'lucide-react';

export const BudgetCard = ({ budget }) => {
  if (!budget) {
    return (
      <div className="glass-panel" style={styles.emptyCard}>
        <Target size={36} color="var(--primary)" />
        <h3 style={{ marginTop: '12px', fontSize: '1.1rem' }}>No Monthly Budget Set</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Configure a monthly target budget limit to track your spending limits in real-time.
        </p>
      </div>
    );
  }

  const { amount, totalSpent, remainingAmount, usagePercentage, budgetExceeded } = budget;

  let progressClass = 'progress-success';
  let badgeStyle = { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
  let statusText = 'Within Budget Goal';
  let StatusIcon = CheckCircle2;

  if (budgetExceeded) {
    progressClass = 'progress-danger';
    badgeStyle = { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
    statusText = 'Budget Exceeded!';
    StatusIcon = Flame;
  } else if (usagePercentage >= 80) {
    progressClass = 'progress-warning';
    badgeStyle = { background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' };
    statusText = 'Near Limit (80%+)';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="glass-panel hover-lift" style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.subtitle}>MONTHLY TARGET BUDGET</span>
          <h3 style={styles.amount} className="tabular-nums">{formatCurrency(amount)}</h3>
        </div>
        <span style={{ ...styles.badge, ...badgeStyle }}>
          <StatusIcon size={14} />
          <span>{statusText}</span>
        </span>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressLabels}>
          <span>Spent: <strong className="tabular-nums">{formatCurrency(totalSpent)}</strong> ({usagePercentage}%)</span>
          <span>Remaining: <strong className="tabular-nums">{formatCurrency(remainingAmount)}</strong></span>
        </div>
        <div className="progress-container" style={{ height: '12px' }}>
          <div
            className={`progress-bar ${progressClass}`}
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
    gap: '22px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    letterSpacing: '0.06em',
  },
  amount: {
    fontSize: '1.85rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    marginTop: '4px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  emptyCard: {
    padding: '36px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
