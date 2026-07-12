import { useEffect, useState } from 'react';
import { authAPI, departmentAPI } from '../services/api';
import { User, Department } from '../types';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Building, UserMinus, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Users() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Editing states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editDeptId, setEditDeptId] = useState('');

  const loadData = async () => {
    try {
      const [userList, deptList] = await Promise.all([
        authAPI.getUsers(),
        departmentAPI.getDepartments()
      ]);
      setUsers(userList);
      setDepartments(deptList);
    } catch (error) {
      console.error('Failed to load users data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateUser = async (userId: string, role?: string, status?: string, deptId?: string | null) => {
    try {
      await authAPI.updateUser({
        userId,
        role,
        status,
        departmentId: deptId === 'none' ? null : deptId,
      });
      setEditingUserId(null);
      loadData();
    } catch (error) {
      alert('Failed to update user parameters.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading directory records...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
        <p className="text-sm text-slate-500">Manage enterprise personnel roles and structural assignments</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-6">Employee</th>
                <th className="py-4">Access Role</th>
                <th className="py-4">Department Assignment</th>
                <th className="py-4">System Status</th>
                {isAdmin && <th className="py-4 pr-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userDept = departments.find(d => d.id === u.departmentId);
                const isSelf = u.id === currentUser?.id;
                const isEditing = editingUserId === u.id;

                return (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/30 text-sm transition-all">
                    <td className="py-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          {u.name} {isSelf && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded border border-indigo-100">You</span>}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3" />
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      {isEditing ? (
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="ASSET_MANAGER">ASSET_MANAGER</option>
                          <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD</option>
                          <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          u.role === 'ASSET_MANAGER' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          u.role === 'DEPARTMENT_HEAD' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          <Shield className="h-3 w-3" />
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      {isEditing ? (
                        <select
                          value={editDeptId}
                          onChange={(e) => setEditDeptId(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700"
                        >
                          <option value="none">No Department</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          {userDept?.name || 'Unassigned'}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleUpdateUser(u.id, editRole, undefined, editDeptId)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingUserId(null)}
                                className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingUserId(u.id);
                                  setEditRole(u.role);
                                  setEditDeptId(u.departmentId || 'none');
                                }}
                                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                              >
                                Edit Profile
                              </button>
                              {!isSelf && (
                                <button
                                  onClick={() => handleUpdateUser(u.id, undefined, u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    u.status === 'ACTIVE' ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={u.status === 'ACTIVE' ? 'Deactivate Access' : 'Activate Access'}
                                >
                                  {u.status === 'ACTIVE' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
