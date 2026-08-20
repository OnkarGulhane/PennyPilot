import React from 'react';
import { formatCurrency } from '../utils/currency';
import { AlertTriangle, CheckCircle2, Flame, Target, Plus, CalendarDays, Edit3 } from 'lucide-react';

export const BudgetCard = ({ budget, onSetBudget, onEditBudget }) => {
  if (!budget || !budget.amount || Number(budget.amount) <= 0) {
    return (
      <div className="glass-panel" style={styles.emptyCard}>
        <div style={styles.emptyHeader}>
          <div style={styles.emptyIconBadge}>
            <Target size={26} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '800' }}>
              No Monthly Budget Target Set
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Define a monthly spending limit to monitor remaining balance and safe daily allowances.
            </p>
          </div>
        </div>
        {onSetBudget && (
          <button onClick={onSetBudget} className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>
            <Plus size={16} />
            <span>Set Current Month Target Budget</span>
          </button>
        )}
      </div>
    );
  }

  const { amount, totalSpent, remainingAmount, usagePercentage, budgetExceeded } = budget;

  // Calculate days remaining in current month for daily safe allowance
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate() + 1);
  const safeDailyAllowance = Math.max(0, (Number(remainingAmount) || 0) / daysRemaining);

  let progressClass = 'progress-success';
  let badgeStyle = { background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' };
  let statusText = 'Within Budget Goal';
  let StatusIcon = CheckCircle2;

  if (budgetExceeded || Number(remainingAmount) < 0) {
    progressClass = 'progress-danger';
    badgeStyle = { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
    statusText = 'Budget Exceeded!';
    StatusIcon = Flame;
  } else if (Number(usagePercentage) >= 80) {
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
        
        <div style={styles.headerActions}>
          <span style={{ ...styles.badge, ...badgeStyle }}>
            <StatusIcon size={14} />
            <span>{statusText}</span>
          </span>
          
          {(onEditBudget || onSetBudget) && (
            <button
              onClick={onEditBudget || onSetBudget}
              style={styles.editBtn}
              title="Edit Target Budget"
            >
              <Edit3 size={15} color="var(--primary)" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Labels */}
      <div style={styles.progressSection}>
        <div style={styles.progressLabels}>
          <span>Spent: <strong className="tabular-nums">{formatCurrency(totalSpent)}</strong> ({usagePercentage}%)</span>
          <span>Remaining: <strong className="tabular-nums" style={{ color: Number(remainingAmount) < 0 ? 'var(--danger)' : 'var(--emerald)' }}>{formatCurrency(remainingAmount)}</strong></span>
        </div>
        <div className="progress-container" style={{ height: '12px' }}>
          <div
            className={`progress-bar ${progressClass}`}
            style={{ width: `${Math.min(Number(usagePercentage) || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Safe Spend Footer */}
      <div style={styles.footerRow}>
        <div style={styles.footerItem}>
          <CalendarDays size={14} color="var(--secondary)" />
          <span>Safe Daily Allowance: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatCurrency(safeDailyAllowance)} / day</strong> ({daysRemaining} days left)</span>
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
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  subtitle: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
  },
  amount: {
    fontSize: '1.9rem',
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
  editBtn: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
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
  footerRow: {
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  emptyCard: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  emptyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  emptyIconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
