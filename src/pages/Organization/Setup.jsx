import React, { useState } from 'react';
import { Users, LayoutList, Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Setup = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const { departments, categories, users } = useAppContext();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Organization Setup</h1>
          <p className="page-subtitle">Manage departments, asset categories, and the employee directory.</p>
        </div>
      </div>

      <div className="tabs-container">
        <div 
          className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
            <Building2 size={18} /> Departments
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
            <LayoutList size={18} /> Asset Categories
          </div>
        </div>
        <div 
          className={`tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
            <Users size={18} /> Employee Directory
          </div>
        </div>
      </div>

      <div className="card">
        {activeTab === 'departments' && (
          <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
              <h3>Departments</h3>
              <button className="btn btn-primary"><Plus size={16} /> Add Department</button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Head</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{dept.head}</td>
                      <td>
                        <span className={`status-badge ${dept.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                          {dept.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                          <button className="icon-btn"><Edit2 size={16} /></button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
              <h3>Asset Categories</h3>
              <button className="btn btn-primary"><Plus size={16} /> Add Category</button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.name}</td>
                      <td>{cat.description}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                          <button className="icon-btn"><Edit2 size={16} /></button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
              <h3>Employee Directory</h3>
              <button className="btn btn-primary"><Plus size={16} /> Invite Employee</button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`status-badge ${user.role === 'Admin' ? 'badge-danger' : user.role === 'Asset Manager' ? 'badge-warning' : 'badge-info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                          <button className="icon-btn"><Edit2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setup;
