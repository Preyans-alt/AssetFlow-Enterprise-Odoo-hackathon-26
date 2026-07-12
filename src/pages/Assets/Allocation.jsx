import React, { useState } from 'react';
import { ArrowRightLeft, Search, Check, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Allocation = () => {
  const { assets, users, allocateAsset, currentUser } = useAppContext();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAllocate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedAsset || !selectedUser) {
      setError('Please select both an asset and a user.');
      return;
    }
    
    const asset = assets.find(a => a.id === selectedAsset);
    if (!asset) return;
    
    if (asset.status === 'Allocated') {
      setError(`Conflict: This asset is already held by ${asset.holder}. Please initiate a transfer request instead.`);
      return;
    }
    
    const user = users.find(u => u.email === selectedUser);
    allocateAsset(asset.id, user.name, returnDate || null);
    setSuccess(`Asset ${asset.id} successfully allocated to ${user.name}.`);
    setSelectedAsset('');
    setSelectedUser('');
    setReturnDate('');
  };

  // Mock pending transfers for Department Head/Asset Manager view
  const pendingTransfers = [
    { id: 'TR-102', assetId: 'AF-0114', from: 'Priya Sharma', to: 'Raj Patel', status: 'Pending', date: '2026-07-11' }
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Allocation & Transfer</h1>
          <p className="page-subtitle">Manage who holds what, with explicit conflict rules.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        {/* Allocation Form */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>New Allocation</h3>
          
          {error && <div className="badge-danger" style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', width: '100%' }}>{error}</div>}
          {success && <div className="badge-success" style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', width: '100%' }}>{success}</div>}
          
          <form onSubmit={handleAllocate}>
            <div className="form-group">
              <label>Select Asset</label>
              <select 
                className="input-field" 
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value="">-- Choose Asset --</option>
                {assets.filter(a => a.category !== 'Shared Resources' && a.status !== 'Retired').map(a => (
                  <option key={a.id} value={a.id}>{a.id} - {a.name} ({a.status})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Select Employee / Department</label>
              <select 
                className="input-field"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">-- Choose Employee --</option>
                {users.map(u => (
                  <option key={u.id} value={u.email}>{u.name} ({u.department})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Expected Return Date (Optional)</label>
              <input 
                type="date" 
                className="input-field"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
              Allocate Asset
            </button>
          </form>
        </div>

        {/* Transfer Requests (Visible to Approvers) */}
        {(currentUser?.role === 'Asset Manager' || currentUser?.role === 'Department Head' || currentUser?.role === 'Admin') && (
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Pending Transfer Requests</h3>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransfers.map(tr => (
                    <tr key={tr.id}>
                      <td style={{ fontWeight: 500 }}>{tr.assetId}</td>
                      <td>{tr.from}</td>
                      <td>{tr.to}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <button className="icon-btn" style={{ color: 'var(--success)' }} title="Approve"><Check size={18} /></button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }} title="Reject"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingTransfers.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)' }}>No pending transfers.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allocation;
