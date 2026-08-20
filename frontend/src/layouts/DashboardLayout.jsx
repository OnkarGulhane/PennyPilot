import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.mainLayout} className="app-layout">
        <Sidebar />
        <main style={styles.content} className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-primary)',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: '28px 32px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
};
