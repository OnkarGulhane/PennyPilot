import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div className="glass-card" style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <AlertTriangle size={24} color="var(--danger)" />
          </div>
          <button onClick={onCancel} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.content}>
          <h3 style={styles.title}>{title || 'Are you sure?'}</h3>
          <p style={styles.message}>{message || 'This action cannot be undone.'}</p>
        </div>

        <div style={styles.actions}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 110,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  iconContainer: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'var(--danger-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  content: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  message: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};
