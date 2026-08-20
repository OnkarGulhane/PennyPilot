import React from 'react';
import { formatCurrency } from '../utils/currency';

export const SummaryCard = ({ title, amount, icon: Icon, color = '#6366f1', subtitle, badgeText }) => {
  return (
    <div className="glass-panel hover-lift" style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <div style={{ ...styles.iconContainer, backgroundColor: `${color}18`, color: color }}>
          <Icon size={20} />
        </div>
      </div>
      
      <div style={styles.amount} className="tabular-nums">
        {formatCurrency(amount)}
      </div>

      <div style={styles.footer}>
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
        {badgeText && (
          <span style={{ ...styles.badge, backgroundColor: `${color}15`, color: color }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '22px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  iconContainer: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: '1.85rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2px',
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px',
  },
};
