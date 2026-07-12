import React from 'react';
import { ClipboardCheck, Search } from 'lucide-react';
import '../../styles/components.css';

const AssetAudit = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Audit</h1>
          <p className="page-subtitle">Run structured verification cycles instead of a single form.</p>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <ClipboardCheck size={20} /> Active Audit Cycles
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>Audit module is currently under development.</p>
      </div>
    </div>
  );
};

export default AssetAudit;
