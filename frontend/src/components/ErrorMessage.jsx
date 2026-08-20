import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div style={styles.container}>
      <AlertCircle size={20} color="var(--danger)" />
      <span style={styles.text}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={styles.retryBtn}>
          Retry
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '12px',
    backgroundColor: 'var(--danger-bg)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  },
  text: {
    flex: 1,
    fontSize: '0.9rem',
    color: 'var(--danger)',
    fontWeight: '500',
  },
  retryBtn: {
    padding: '4px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '6px',
    backgroundColor: 'var(--danger)',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
  },
};
