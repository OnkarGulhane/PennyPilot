import React from 'react';
import { formatCurrency } from '../utils/currency';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  color = '#6366f1',
  subtitle,
  badgeText,
}) => {
  return (
    <div
      className="glass-panel hover-lift"
      style={{
        ...styles.card,
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={styles.topRow}>
        <div style={{ ...styles.iconBadge, backgroundColor: `${color}18`, color }}>
          <Icon size={20} />
        </div>
        {badgeText && (
          <span style={{ ...styles.badge, backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}>
            {badgeText}
          </span>
        )}
      </div>

      <div style={styles.content}>
        <span style={styles.title}>{title}</span>
        <h3 style={styles.amount} className="tabular-nums">{formatCurrency(amount)}</h3>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      <div style={styles.trendRow}>
        <div style={styles.trendItem}>
          <ArrowUpRight size={13} color="var(--emerald)" />
          <span style={{ color: 'var(--emerald)', fontWeight: '700' }}>Active Sync</span>
        </div>
        <span style={styles.trendLabel}>Live DB</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '9999px',
    letterSpacing: '0.06em',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  amount: {
    fontSize: '1.9rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  trendRow: {
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
  },
  trendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  trendLabel: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
};
