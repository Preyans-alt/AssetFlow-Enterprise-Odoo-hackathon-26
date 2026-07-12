import React, { useState } from 'react';
import { PackageSearch, Filter, Plus, Eye, Edit2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Directory = () => {
  const { assets } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Directory</h1>
          <p className="page-subtitle">View and manage all registered assets.</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Register Asset</button>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div className="header-search" style={{ width: '100%', maxWidth: '400px' }}>
            <PackageSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, tag, serial..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select 
              className="input-field" 
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Holder</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td style={{ fontWeight: 500 }}>{asset.id}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.condition}</td>
                  <td>
                    <span className={`status-badge ${
                      asset.status === 'Available' ? 'badge-success' : 
                      asset.status === 'Allocated' ? 'badge-info' : 
                      asset.status === 'Under Maintenance' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td>{asset.holder || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <button className="icon-btn"><Eye size={16} /></button>
                      <button className="icon-btn"><Edit2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Directory;
