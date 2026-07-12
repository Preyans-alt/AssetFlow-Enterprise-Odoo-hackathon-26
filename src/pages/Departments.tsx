import { useEffect, useState } from 'react';
import { departmentAPI, authAPI } from '../services/api';
import { Department, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { Building, Plus, FolderTree, FileSignature, HelpCircle } from 'lucide-react';

export default function Departments() {
  const { user: currentUser } = useAuth();
  const isAdminOrManager = currentUser?.role === 'ADMIN' || currentUser?.role === 'ASSET_MANAGER';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptParentId, setNewDeptParentId] = useState('');
  const [newDeptHeadId, setNewDeptHeadId] = useState('');

  // Editing state
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editDeptName, setEditDeptName] = useState('');
  const [editDeptParentId, setEditDeptParentId] = useState('');
  const [editDeptHeadId, setEditDeptHeadId] = useState('');

  const loadData = async () => {
    try {
      const [deptList, userList] = await Promise.all([
        departmentAPI.getDepartments(),
        authAPI.getUsers()
      ]);
      setDepartments(deptList);
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load departments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    try {
      await departmentAPI.createDepartment({
        name: newDeptName,
        parentId: newDeptParentId || null,
        headId: newDeptHeadId || null,
      });
      setShowAddDept(false);
      setNewDeptName('');
      setNewDeptParentId('');
      setNewDeptHeadId('');
      loadData();
    } catch (error) {
      alert('Failed to establish department unit');
    }
  };

  const handleUpdateDept = async (id: string) => {
    try {
      await departmentAPI.updateDepartment(id, {
        name: editDeptName,
        parentId: editDeptParentId === 'none' ? null : editDeptParentId,
        headId: editDeptHeadId === 'none' ? null : editDeptHeadId,
      });
      setEditingDeptId(null);
      loadData();
    } catch (error) {
      alert('Failed to update department unit');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading department maps...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      {/* Structural Hierarchy View */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Division Hierarchy</h2>
        <p className="text-xs text-slate-500 mb-6">Organizational nested departments and divisions.</p>

        <div className="space-y-3">
          {departments.filter(d => !d.parentId).map((rootDept) => {
            const children = departments.filter(d => d.parentId === rootDept.id);

            return (
              <div key={rootDept.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                  <Building className="h-4 w-4" />
                  <span>{rootDept.name}</span>
                </div>
                {children.length > 0 && (
                  <div className="mt-2 ml-4 pl-3 border-l-2 border-indigo-100 space-y-1.5">
                    {children.map(child => (
                      <div key={child.id} className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <FolderTree className="h-3.5 w-3.5 text-slate-400" />
                        <span>{child.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {departments.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No corporate departments registered yet.
            </div>
          )}
        </div>
      </div>

      {/* Directory of Divisions list */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Corporate Divisions</h2>
            <p className="text-xs text-slate-500">Corporate division list, leader designations and heads mapping.</p>
          </div>
          {isAdminOrManager && (
            <button
              onClick={() => setShowAddDept(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Division
            </button>
          )}
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-6">
          {departments.map((dept) => {
            const isEditing = editingDeptId === dept.id;
            const deptHeadObj = users.find(u => u.id === dept.headId);
            const parentDeptObj = departments.find(d => d.id === dept.parentId);

            return (
              <div
                key={dept.id}
                className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm flex items-start justify-between gap-4 transition-all"
              >
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editDeptName}
                      onChange={(e) => setEditDeptName(e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Building className="h-4 w-4 text-indigo-600" />
                      {dept.name}
                    </h4>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Division Head</span>
                      {isEditing ? (
                        <select
                          value={editDeptHeadId}
                          onChange={(e) => setEditDeptHeadId(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 mt-1"
                        >
                          <option value="none">Unassigned</option>
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-slate-600 font-semibold">
                          {deptHeadObj?.name || 'Unassigned'}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent Division</span>
                      {isEditing ? (
                        <select
                          value={editDeptParentId}
                          onChange={(e) => setEditDeptParentId(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 mt-1"
                        >
                          <option value="none">Root level (None)</option>
                          {departments.filter(d => d.id !== dept.id).map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-slate-500 font-semibold">
                          {parentDeptObj?.name || 'Root Division'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isAdminOrManager && (
                  <div className="flex gap-1.5 self-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdateDept(dept.id)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDeptId(null)}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingDeptId(dept.id);
                          setEditDeptName(dept.name);
                          setEditDeptHeadId(dept.headId || 'none');
                          setEditDeptParentId(dept.parentId || 'none');
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Edit Map
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Add Division */}
      {showAddDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Add Corporate Division</h3>
              <button onClick={() => setShowAddDept(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleCreateDept} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Division Name</label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="Software Engineering"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nesting Parent Division (Optional)</label>
                <select
                  value={newDeptParentId}
                  onChange={(e) => setNewDeptParentId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- None (Root Level) --</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Division Leader / Head (Optional)</label>
                <select
                  value={newDeptHeadId}
                  onChange={(e) => setNewDeptHeadId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Unassigned --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDept(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Establish Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
