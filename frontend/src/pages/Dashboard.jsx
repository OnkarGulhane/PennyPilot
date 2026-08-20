import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { expenseApi } from '../api/expenseApi';
import { budgetApi } from '../api/budgetApi';
import { SummaryCard } from '../components/SummaryCard';
import { BudgetCard } from '../components/BudgetCard';
import { ExpenseTable } from '../components/ExpenseTable';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { DollarSign, Calendar, TrendingUp, Award, Plus, Sparkles, Activity, PieChart as PieIcon, BarChart3, Wallet } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/currency';
import { formatMonthYear } from '../utils/date';
import { ExpenseForm } from '../components/ExpenseForm';

const COLORS = [
  '#6366f1', '#06b6d4', '#ec4899', '#ef4444', '#a855f7',
  '#10b981', '#3b82f6', '#f59e0b', '#22c55e', '#94a3b8'
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [currentBudget, setCurrentBudget] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSetBudgetOpen, setIsSetBudgetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const [budgetInput, setBudgetInput] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, catRes, monthRes, expRes, budgetRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getCategorySummary(),
        dashboardApi.getMonthlySummary(),
        expenseApi.getExpenses({ page: 0, size: 5, sort: 'expenseDate,desc' }),
        budgetApi.getBudgets(),
      ]);

      setSummary(sumRes);
      setCategoryData(catRes || []);
      setMonthlyData(
        (monthRes || []).map((item) => ({
          ...item,
          formattedMonth: formatMonthYear(item.month),
        }))
      );
      setRecentExpenses(expRes?.content || []);
      
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      let foundBudget = (budgetRes || []).find(
        (b) => Number(b.month) === currentMonth && Number(b.year) === currentYear
      );

      if (!foundBudget && sumRes?.monthlyBudget > 0) {
        foundBudget = {
          amount: sumRes.monthlyBudget,
          totalSpent: sumRes.currentMonthExpense,
          remainingAmount: sumRes.remainingBudget,
          usagePercentage: sumRes.budgetUsagePercentage,
          budgetExceeded: sumRes.budgetExceeded,
        };
      }

      setCurrentBudget(foundBudget || null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateExpense = async (formData) => {
    setSubmitting(true);
    try {
      await expenseApi.createExpense(formData);
      setIsAddExpenseOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(budgetInput);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid budget amount greater than ₹0');
      return;
    }

    setSubmitting(true);
    try {
      await budgetApi.createBudget({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: amountNum,
      });
      setIsSetBudgetOpen(false);
      setBudgetInput('');
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to save budget target');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading Financial Analytics Engine..." />;

  return (
    <div style={styles.container}>
      {/* Hero Financial Health Header Banner */}
      <div className="glass-panel hero-banner-responsive" style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <div style={styles.heroBadge}>
            <Activity size={16} color="var(--emerald)" />
            <span>FINANCIAL OVERVIEW</span>
          </div>
          <h1 style={styles.heroTitle}>Smart Expense Dashboard</h1>
          <p style={styles.heroSubtitle}>
            Real-time PostgreSQL financial monitoring, category breakdown, and monthly budget utilization.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button onClick={() => setIsAddExpenseOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Quick Record Expense</span>
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={fetchDashboardData} />

      {/* Metric Cards Row */}
      <div style={styles.metricsGrid} className="grid-responsive-4col">
        <SummaryCard
          title="Total Lifetime Spent"
          amount={summary?.totalExpense || 0}
          icon={DollarSign}
          color="#6366f1"
          subtitle="Aggregate lifetime transactions"
          badgeText="ALL TIME"
        />
        <SummaryCard
          title="This Month Spend"
          amount={summary?.currentMonthExpense || 0}
          icon={Calendar}
          color="#06b6d4"
          subtitle="Spent in current calendar month"
          badgeText="CURRENT MONTH"
        />
        <SummaryCard
          title="Spent Today"
          amount={summary?.todayExpense || 0}
          icon={TrendingUp}
          color="#10b981"
          subtitle="Expenses recorded today"
          badgeText="TODAY"
        />
        <SummaryCard
          title="Single Largest Expense"
          amount={summary?.highestExpense || 0}
          icon={Award}
          color="#f59e0b"
          subtitle="Highest transaction amount"
          badgeText="PEAK SPEND"
        />
      </div>

      {/* Budget & Category Breakdown Grid */}
      <div style={styles.chartsGrid} className="grid-responsive-2col">
        <BudgetCard
          budget={currentBudget}
          onSetBudget={() => setIsSetBudgetOpen(true)}
        />

        {/* Category Pie Chart */}
        <div className="glass-panel" style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div style={styles.chartTitleGroup}>
              <PieIcon size={18} color="var(--primary)" />
              <h3 style={styles.chartTitle}>Category Spending Breakdown</h3>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <div style={{ width: '100%', height: 260, position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={styles.tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={styles.noData}>No expense category distribution available yet.</div>
          )}
        </div>
      </div>

      {/* Monthly Trend Bar Chart */}
      <div className="glass-panel" style={{ ...styles.chartCard, marginTop: '24px' }}>
        <div style={styles.chartHeader}>
          <div style={styles.chartTitleGroup}>
            <BarChart3 size={18} color="var(--secondary)" />
            <h3 style={styles.chartTitle}>Monthly Spending Trend (Past 6 Months)</h3>
          </div>
        </div>
        {monthlyData.length > 0 ? (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="formattedMonth" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={styles.tooltipStyle}
                />
                <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={styles.noData}>No historical monthly spending data available yet.</div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="glass-panel" style={{ marginTop: '24px', padding: '24px' }}>
        <div style={styles.sectionHeader}>
          <h3>Recent Transactions</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest 5 entries</span>
        </div>
        <ExpenseTable
          expenses={recentExpenses}
          page={0}
          totalPages={1}
          totalElements={recentExpenses.length}
          onPageChange={() => {}}
        />
      </div>

      {/* Add Expense Modal */}
      <ExpenseForm
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />

      {/* Quick Set Budget Modal */}
      {isSetBudgetOpen && (
        <div style={styles.overlay}>
          <div className="glass-panel" style={styles.budgetModal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalIcon}>
                <Wallet size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Set Current Month Budget</h3>
            </div>

            <form onSubmit={handleSaveBudget}>
              <div className="form-group" style={{ margin: '20px 0' }}>
                <label className="form-label">Monthly Target Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="e.g. 20000.00"
                  className="form-control-pro"
                  autoFocus
                  required
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsSetBudgetOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving...' : 'Save Target Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  heroBanner: {
    padding: '32px',
    background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.18), transparent 60%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.12), transparent 50%), var(--bg-card)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxWidth: '650px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--emerald)',
    letterSpacing: '0.08em',
  },
  heroTitle: {
    fontSize: '2rem',
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  heroSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '24px',
  },
  chartCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  chartHeader: {
    marginBottom: '16px',
  },
  chartTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  chartTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
  },
  noData: {
    padding: '60px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    color: 'var(--text-primary)',
  },
  tooltipStyle: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderColor: 'var(--border-color)',
    borderRadius: '10px',
    color: '#ffffff',
    boxShadow: 'var(--shadow-md)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 120,
    padding: '16px',
  },
  budgetModal: {
    width: '100%',
    maxWidth: '440px',
    padding: '28px',
    borderRadius: '20px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  modalIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
};
