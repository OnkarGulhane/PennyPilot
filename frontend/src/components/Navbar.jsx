import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, Sparkles, Activity, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header style={styles.header} className="navbar-responsive">
      <div style={styles.brandGroup}>
        <div style={styles.logoBadge}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div style={styles.brandTitleGroup}>
          <div style={styles.brandRow}>
            <span style={styles.brandName}>SmartExpense</span>
            <span style={styles.proTag}>PRO</span>
          </div>
          <span style={styles.subText}>Fintech Intelligence</span>
        </div>
      </div>

      <div style={styles.statusPill}>
        <span style={styles.statusDot} className="animate-pulse-glow" />
        <span>PostgreSQL API Live</span>
      </div>

      <div style={styles.rightGroup}>
        <button onClick={toggleTheme} style={styles.iconBtn} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {user && (
          <div style={styles.userSection}>
            <div style={styles.avatarRing}>
              <div style={styles.avatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            <div style={styles.userInfo} className="navbar-user-details">
              <span style={styles.userName}>{user.name || 'User'}</span>
              <span style={styles.userEmail}>{user.email}</span>
            </div>

            <button onClick={logout} style={styles.logoutBtn} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '68px',
    backgroundColor: 'var(--bg-glass)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 90,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glow)',
  },
  brandTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  brandName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
  },
  proTag: {
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  subText: {
    fontSize: '0.725rem',
    color: 'var(--text-muted)',
    marginTop: '-2px',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: 'var(--emerald)',
    fontSize: '0.775rem',
    fontWeight: '700',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--emerald)',
    boxShadow: '0 0 10px var(--emerald)',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '12px',
    borderLeft: '1px solid var(--border-color)',
  },
  avatarRing: {
    padding: '2px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #10b981)',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '0.875rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1.2',
  },
  userEmail: {
    fontSize: '0.725rem',
    color: 'var(--text-muted)',
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
};
