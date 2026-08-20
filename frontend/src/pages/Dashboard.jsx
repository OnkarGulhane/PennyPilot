import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { expenseApi } from '../api/expenseApi';
import { budgetApi } from '../api/budgetApi';
import { SummaryCard } from '../components/SummaryCard';
import { BudgetCard } from '../components/BudgetCard';
import { ExpenseTable } from '../components/ExpenseTable';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { DollarSign, Calendar, TrendingUp, Award, Plus } from 'lucide-react';
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      
      // Get current month budget
      const now = new Date();
      const currentMonthBudget = (budgetRes || []).find(
        (b) => b.month === now.getMonth() + 1 && b.year === now.getFullYear()
      );
      setCurrentBudget(currentMonthBudget || null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
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
      setIsAddOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading Dashboard Analytics..." />;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard Analytics</h1>
          <p style={styles.pageSubtitle}>Overview of your financial activity and budget goals</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      <ErrorMessage message={error} onRetry={fetchDashboardData} />

      {/* Metric Cards Row */}
      <div style={styles.metricsGrid}>
        <SummaryCard
          title="Total Spent"
          amount={summary?.totalExpense || 0}
          icon={DollarSign}
          color="#6366f1"
          subtitle="Lifetime total expenses"
        />
        <SummaryCard
          title="This Month"
          amount={summary?.currentMonthExpense || 0}
          icon={Calendar}
          color="#06b6d4"
          subtitle="Expenses in current month"
        />
        <SummaryCard
          title="Spent Today"
          amount={summary?.todayExpense || 0}
          icon={TrendingUp}
          color="#10b981"
          subtitle="Expenses recorded today"
        />
        <SummaryCard
          title="Highest Expense"
          amount={summary?.highestExpense || 0}
          icon={Award}
          color="#f59e0b"
          subtitle="Single largest transaction"
        />
      </div>

      {/* Budget & Category Breakdown Grid */}
      <div style={styles.chartsGrid}>
        <BudgetCard budget={currentBudget} />

        {/* Category Pie Chart */}
        <div className="glass-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Category Spending Breakdown</h3>
          {categoryData.length > 0 ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
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
            <div style={styles.noData}>No expense category data available yet.</div>
          )}
        </div>
      </div>

      {/* Monthly Trend Bar Chart */}
      <div className="glass-card" style={{ ...styles.chartCard, marginTop: '24px' }}>
        <h3 style={styles.chartTitle}>Monthly Spending Trend (Past 6 Months)</h3>
        {monthlyData.length > 0 ? (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="formattedMonth" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={styles.tooltipStyle}
                />
                <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={styles.noData}>No monthly historical data available yet.</div>
        )}
      </div>

      {/* Recent Transactions Section */}
      <div className="glass-card" style={{ marginTop: '24px', padding: '24px' }}>
        <div style={styles.sectionHeader}>
          <h3>Recent Transactions</h3>
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
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateExpense}
        loading={submitting}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '1.75rem',
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
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
  chartTitle: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    marginBottom: '16px',
  },
  noData: {
    padding: '60px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  sectionHeader: {
    marginBottom: '16px',
    color: 'var(--text-primary)',
  },
  tooltipStyle: {
    backgroundColor: 'var(--bg-secondary)',
    borderColor: 'var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
  },
};
