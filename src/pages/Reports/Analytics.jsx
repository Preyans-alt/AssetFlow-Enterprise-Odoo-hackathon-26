import React from 'react';
import { BarChart3 } from 'lucide-react';
import '../../styles/components.css';

const Analytics = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Actionable operational insights for managers.</p>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <BarChart3 size={20} /> Operational Insights
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>Analytics module is currently under development.</p>
      </div>
    </div>
  );
};

export default Analytics;
