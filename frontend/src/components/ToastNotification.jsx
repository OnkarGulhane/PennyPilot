import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-panel animate-modal-pop"
            style={{
              ...styles.toast,
              ...(toast.type === 'error' ? styles.toastError : toast.type === 'info' ? styles.toastInfo : styles.toastSuccess),
            }}
          >
            <div style={styles.toastIcon}>
              {toast.type === 'error' && <AlertCircle size={18} color="var(--danger)" />}
              {toast.type === 'info' && <Info size={18} color="var(--secondary)" />}
              {toast.type === 'success' && <CheckCircle2 size={18} color="var(--emerald)" />}
            </div>
            <span style={styles.toastText}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = {
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '380px',
    pointerEvents: 'none',
  },
  toast: {
    padding: '14px 18px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    pointerEvents: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  toastSuccess: {
    borderLeft: '4px solid var(--emerald)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  toastError: {
    borderLeft: '4px solid var(--danger)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  toastInfo: {
    borderLeft: '4px solid var(--secondary)',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
  },
  toastIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },
};
