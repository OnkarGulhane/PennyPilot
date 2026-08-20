import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  confirmText = 'Delete Entry',
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} className="animate-backdrop">
      <div className="glass-panel modal-responsive animate-modal-pop" style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.iconBadge}>
            <AlertTriangle size={22} color="var(--danger)" />
          </div>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onCancel} style={styles.closeBtn} title="Cancel">
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.actions}>
          <button onClick={onCancel} className="btn btn-secondary btn-sm" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger btn-sm" disabled={loading}>
            {loading ? 'Processing...' : confirmText}
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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 150,
    padding: '16px',
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    padding: '24px',
    borderRadius: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px',
  },
  iconBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'var(--danger-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: '800',
    flex: 1,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  body: {
    marginBottom: '20px',
  },
  message: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};
