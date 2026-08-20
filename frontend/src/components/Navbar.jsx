import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

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
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div style={styles.brandContainer}>
          <span style={styles.brandTitle}>SmartExpense</span>
          <span style={styles.brandTag}>V1.0 PRO</span>
        </div>
      </div>

      <div style={styles.rightSection}>
        <button
          onClick={toggleTheme}
          style={styles.iconBtn}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <div style={styles.userInfo}>
          <div style={styles.avatarRing}>
            <div style={styles.avatar}>{getInitials(user?.name)}</div>
          </div>
          <div style={styles.userDetails}>
            <div style={styles.userRow}>
              <span style={styles.userName}>{user?.name || 'User'}</span>
              <ShieldCheck size={14} color="var(--emerald)" />
            </div>
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
    padding: '14px 28px',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(16px)',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  logoBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.35rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  brandTag: {
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '6px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  iconBtn: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '16px',
    borderLeft: '1px solid var(--border-color)',
  },
  avatarRing: {
    padding: '2px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #10b981)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-secondary)',
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
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: '700',
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
    padding: '8px 16px',
    borderRadius: '10px',
    backgroundColor: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'var(--transition)',
  },
};
