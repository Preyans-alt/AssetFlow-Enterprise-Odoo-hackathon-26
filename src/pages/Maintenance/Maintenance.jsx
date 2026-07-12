import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Maintenance = () => {
  const { maintenance, assets, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simplified add logic for POC
    alert('Maintenance request submitted successfully.');
    setSelectedAsset('');
    setIssue('');
    setPriority('Medium');
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Management</h1>
          <p className="page-subtitle">Route repairs through approval before work starts.</p>
        </div>
      </div>

      <div className="tabs-container">
        <div 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          All Requests
        </div>
        <div 
          className={`tab ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          Raise New Request
        </div>
      </div>

      {activeTab === 'requests' && (
        <div className="card animate-fade-in">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Asset</th>
                  <th>Issue</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 500 }}>REQ-{req.id}</td>
                    <td>{req.asset}</td>
                    <td>{req.issue}</td>
                    <td>
                      <span className={`status-badge ${
                        req.priority === 'High' ? 'badge-danger' : 
                        req.priority === 'Medium' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        req.status === 'Resolved' ? 'badge-success' : 
                        req.status === 'In Progress' ? 'badge-info' : 'badge-neutral'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{req.reportedBy}</td>
                    <td>
                      {(currentUser?.role === 'Asset Manager' || currentUser?.role === 'Admin') && req.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <button className="icon-btn" style={{ color: 'var(--success)' }} title="Approve"><CheckCircle size={18} /></button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }} title="Reject"><XCircle size={18} /></button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>View Details</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'new' && (
        <div className="card animate-fade-in" style={{ maxWidth: '600px' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Raise Maintenance Request</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Asset</label>
              <select 
                className="input-field"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
              >
                <option value="">-- Choose Asset --</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Issue Description</label>
              <textarea 
                className="input-field"
                rows="4"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                placeholder="Describe the issue in detail..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select 
                className="input-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
              <Plus size={18} /> Submit Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
