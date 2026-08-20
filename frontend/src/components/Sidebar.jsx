import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, PieChart, Layers } from 'lucide-react';

export const Sidebar = () => {
  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Budgets', path: '/budget', icon: Wallet },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sectionHeader}>MAIN NAVIGATION</div>
      <nav style={styles.nav}>
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {}),
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.quickCard}>
        <div style={styles.quickCardIcon}>
          <Layers size={18} color="var(--primary)" />
        </div>
        <div style={styles.quickCardText}>
          <strong>Smart Analytics</strong>
          <span>Real-time PostgreSQL metrics active</span>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 69px)',
  },
  sectionHeader: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    marginBottom: '12px',
    paddingLeft: '12px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    fontSize: '0.925rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'var(--transition)',
    position: 'relative',
  },
  activeLink: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: '700',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  quickCard: {
    padding: '14px',
    borderRadius: '14px',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: 'auto',
  },
  quickCardIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCardText: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
};
