import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User, DollarSign } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <div style={styles.logoBadge}>
          <DollarSign size={20} color="#ffffff" />
        </div>
        <span style={styles.brandTitle}>SmartExpense</span>
      </div>

      <div style={styles.rightSection}>
        <button
          onClick={toggleTheme}
          style={styles.iconBtn}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={styles.userInfo}>
          <div style={styles.avatar}>{getInitials(user?.name)}</div>
          <div style={styles.userDetails}>
            <span style={styles.userName}>{user?.name || 'User'}</span>
            <span style={styles.userEmail}>{user?.email}</span>
          </div>
        </div>

        <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(10px)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconBtn: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '12px',
    borderLeft: '1px solid var(--border-color)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    backgroundColor: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'var(--transition)',
  },
};
