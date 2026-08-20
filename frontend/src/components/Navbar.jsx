import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sun, Moon, Sparkles, Bell, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const notifications = [
    {
      id: 1,
      title: 'PostgreSQL Database Connected',
      time: 'Just now',
      desc: 'Flyway migration V1 active on PostgreSQL 17.11',
      icon: Database,
      color: 'var(--emerald)',
    },
    {
      id: 2,
      title: 'JWT Session Authenticated',
      time: 'Active',
      desc: 'Bearer token active for user workspace',
      icon: ShieldCheck,
      color: 'var(--primary)',
    },
  ];

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
        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={styles.iconBtn}
            title="System Notifications"
          >
            <Bell size={18} color="var(--text-secondary)" />
            <span style={styles.notifDot} />
          </button>

          {isNotifOpen && (
            <div className="glass-panel animate-modal-pop" style={styles.notifDropdown}>
              <div style={styles.notifHeader}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                  System Notifications
                </h4>
                <span style={styles.notifCount}>2 Active</span>
              </div>
              <div style={styles.notifList}>
                {notifications.map((n) => {
                  const NotifIcon = n.icon;
                  return (
                    <div key={n.id} style={styles.notifItem}>
                      <div style={{ ...styles.notifIcon, backgroundColor: `${n.color}15` }}>
                        <NotifIcon size={16} color={n.color} />
                      </div>
                      <div style={styles.notifContent}>
                        <div style={styles.notifTitleRow}>
                          <span style={styles.notifTitle}>{n.title}</span>
                          <span style={styles.notifTime}>{n.time}</span>
                        </div>
                        <span style={styles.notifDesc}>{n.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
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
    gap: '14px',
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
    position: 'relative',
    transition: 'var(--transition)',
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    boxShadow: '0 0 6px var(--primary)',
  },
  notifDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '320px',
    padding: '16px',
    borderRadius: '16px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
  },
  notifHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid var(--border-color)',
  },
  notifCount: {
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '9999px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  notifItem: {
    display: 'flex',
    gap: '10px',
    padding: '8px',
    borderRadius: '10px',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  notifIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  notifTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '6px',
  },
  notifTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  notifTime: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  notifDesc: {
    fontSize: '0.725rem',
    color: 'var(--text-secondary)',
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
