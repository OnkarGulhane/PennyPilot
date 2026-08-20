import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: 'omkar@example.com',
    password: 'SecurePassword123',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h2 style={styles.title}>SmartExpense PRO</h2>
          <p style={styles.subtitle}>Sign in to your financial intelligence workspace</p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputIconWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control-pro"
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputIconWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="form-control-pro"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '14px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
          </button>
        </form>

        <div style={styles.featurePills}>
          <div style={styles.featurePill}>
            <ShieldCheck size={14} color="var(--emerald)" />
            <span>JWT Security</span>
          </div>
          <div style={styles.featurePill}>
            <Zap size={14} color="var(--secondary)" />
            <span>Real-time Analytics</span>
          </div>
        </div>

        <div style={styles.footer}>
          <span>Don't have an account? </span>
          <Link to="/register" style={styles.link}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.25), transparent 50%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.15), transparent 50%), var(--bg-primary)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '38px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  logoBadge: {
    width: '60px',
    height: '60px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-glow)',
  },
  title: {
    fontSize: '1.85rem',
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputIconWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--text-muted)',
  },
  eyeBtn: {
    position: 'absolute',
    right: '14px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  featurePills: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-color)',
  },
  featurePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  link: {
    fontWeight: '700',
    color: 'var(--primary)',
  },
};
