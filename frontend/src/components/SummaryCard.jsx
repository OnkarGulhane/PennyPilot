import React from 'react';
import { formatCurrency } from '../utils/currency';

export const SummaryCard = ({ title, amount, icon: Icon, color = '#6366f1', subtitle }) => {
  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <div style={{ ...styles.iconContainer, backgroundColor: `${color}20`, color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={styles.amount}>{formatCurrency(amount)}</div>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

const styles = {
  card: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: '1.75rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
};
