import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Budgets', path: '/budget', icon: Wallet },
  ];

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {navItems.map((item) => {
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
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 61px)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'var(--transition)',
  },
  activeLink: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
};
