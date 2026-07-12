import { useEffect, useState } from 'react';
import { assetAPI, departmentAPI, authAPI } from '../services/api';
import { Asset, Category, Department, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Tag, MapPin, UserPlus, FileSignature, ArrowRightLeft, FolderOpen } from 'lucide-react';

export default function Assets() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals & Forms
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAllocate, setShowAllocate] = useState<Asset | null>(null);
  const [showReturn, setShowReturn] = useState<Asset | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Form states
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newCondition, setNewCondition] = useState('New');
  const [newLocation, setNewLocation] = useState('Main Office');
  const [newIsBookable, setNewIsBookable] = useState(false);

  // Allocation states
  const [allocateUser, setAllocateUser] = useState('');
  const [allocateDept, setAllocateDept] = useState('');
  const [allocateReturnDate, setAllocateReturnDate] = useState('');

  // Return states
  const [returnCondition, setReturnCondition] = useState('Good');

  // Category state
  const [newCatName, setNewCatName] = useState('');

  const loadData = async () => {
    try {
      const [assetList, catList, deptList, userList] = await Promise.all([
        assetAPI.getAssets(),
        assetAPI.getCategories(),
        departmentAPI.getDepartments(),
        authAPI.getUsers()
      ]);
      setAssets(assetList);
      setCategories(catList);
      setDepartments(deptList);
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load assets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assetAPI.createAsset({
        name: newAssetName,
        categoryId: newAssetCategory,
        serialNumber: newSerial,
        acquisitionCost: newCost,
        condition: newCondition,
        location: newLocation,
        isBookable: newIsBookable,
      });
      setShowAddAsset(false);
      setNewAssetName('');
      loadData();
    } catch (error) {
      alert('Failed to register asset. Check details.');
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAllocate) return;
    try {
      await assetAPI.allocateAsset(showAllocate.id, {
        assignedToUser: allocateUser || null,
        assignedToDept: allocateDept || null,
        expectedReturn: allocateReturnDate || null,
      });
      setShowAllocate(null);
      setAllocateUser('');
      setAllocateDept('');
      setAllocateReturnDate('');
      loadData();
    } catch (error) {
      alert('Failed to allocate asset');
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReturn) return;
    try {
      await assetAPI.returnAsset(showReturn.id, { condition: returnCondition });
      setShowReturn(null);
      loadData();
    } catch (error) {
      alert('Failed to return asset');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assetAPI.createCategory({ name: newCatName });
      setShowAddCategory(false);
      setNewCatName('');
      loadData();
    } catch (error) {
      alert('Failed to create category');
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                          asset.assetTag.toLowerCase().includes(search.toLowerCase()) ||
                          (asset.serialNumber && asset.serialNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || asset.categoryId === selectedCategory;
    const matchesStatus = !selectedStatus || asset.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading asset inventory...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assets</h1>
          <p className="text-sm text-slate-500">Manage, allocate and audit physical assets</p>
        </div>
        {isAdminOrManager && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <FolderOpen className="h-4 w-4" />
              Add Category
            </button>
            <button
              onClick={() => {
                if (categories.length === 0) {
                  alert('Please create at least one Category first!');
                  return;
                }
                setNewAssetCategory(categories[0].id);
                setShowAddAsset(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Register Asset
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
            placeholder="Search by asset name, tag, or serial..."
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ALLOCATED">Allocated</option>
            <option value="UNDER_MAINTENANCE">Under Repair</option>
            <option value="LOST">Lost</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-6">Tag / Asset</th>
                <th className="py-4">Category</th>
                <th className="py-4">Condition</th>
                <th className="py-4">Location</th>
                <th className="py-4">Shared Status</th>
                <th className="py-4">Allocation State</th>
                {isAdminOrManager && <th className="py-4 pr-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => {
                  const assignedUserObj = users.find(u => u.id === asset.assignedToUser);
                  const assignedDeptObj = departments.find(d => d.id === asset.assignedToDept);

                  return (
                    <tr key={asset.id} className="border-b border-slate-50 hover:bg-slate-50/50 text-sm transition-all">
                      <td className="py-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100 self-start mb-1">
                            {asset.assetTag}
                          </span>
                          <span className="font-semibold text-slate-800">{asset.name}</span>
                          {asset.serialNumber && <span className="text-xs text-slate-400 font-medium">S/N: {asset.serialNumber}</span>}
                        </div>
                      </td>
                      <td className="py-4 font-medium text-slate-600">{asset.category?.name || 'Unassigned'}</td>
                      <td className="py-4">
                        <span className="text-slate-600 font-medium">{asset.condition || 'Good'}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {asset.location || 'Central Depot'}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                          asset.isBookable ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {asset.isBookable ? 'Shared Scheduler' : 'Dedicated'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold self-start ${
                            asset.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' :
                            asset.status === 'ALLOCATED' ? 'bg-indigo-50 text-indigo-700' :
                            asset.status === 'UNDER_MAINTENANCE' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {asset.status}
                          </span>
                          {asset.status === 'ALLOCATED' && (
                            <span className="text-xs text-slate-500 font-medium">
                              Assigned to:{' '}
                              <strong className="text-slate-700">
                                {assignedUserObj?.name || assignedDeptObj?.name || 'Unknown'}
                              </strong>
                            </span>
                          )}
                        </div>
                      </td>
                      {isAdminOrManager && (
                        <td className="py-4 pr-6 text-right">
                          <div className="flex justify-end gap-1.5">
                            {asset.status === 'AVAILABLE' ? (
                              <button
                                onClick={() => setShowAllocate(asset)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg text-indigo-600 text-xs font-semibold transition-all cursor-pointer"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Allocate
                              </button>
                            ) : asset.status === 'ALLOCATED' ? (
                              <button
                                onClick={() => setShowReturn(asset)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 hover:border-rose-300 hover:bg-rose-50 rounded-lg text-rose-600 text-xs font-semibold transition-all cursor-pointer"
                              >
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Return
                              </button>
                            ) : null}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No assets matched the active search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register Asset */}
      {showAddAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Register Physical Asset</h3>
              <button onClick={() => setShowAddAsset(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleCreateAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Asset Category</label>
                <select
                  value={newAssetCategory}
                  onChange={(e) => setNewAssetCategory(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="MacBook Pro 16-inch"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    placeholder="C02F5XX"
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="2499"
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Initial Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBookable"
                  checked={newIsBookable}
                  onChange={(e) => setNewIsBookable(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isBookable" className="text-sm text-slate-600 font-medium">Mark as bookable (meeting rooms, projectors, pools)</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Allocate Asset */}
      {showAllocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Allocate Asset: {showAllocate.name}</h3>
              <button onClick={() => setShowAllocate(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleAllocate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Allocate to Employee</label>
                <select
                  value={allocateUser}
                  onChange={(e) => {
                    setAllocateUser(e.target.value);
                    if (e.target.value) setAllocateDept('');
                  }}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Choose Employee --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">OR</div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Allocate to Department</label>
                <select
                  value={allocateDept}
                  onChange={(e) => {
                    setAllocateDept(e.target.value);
                    if (e.target.value) setAllocateUser('');
                  }}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Choose Department --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expected Return Date</label>
                <input
                  type="date"
                  value={allocateReturnDate}
                  onChange={(e) => setAllocateReturnDate(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAllocate(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!allocateUser && !allocateDept}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  Perform Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Return Asset */}
      {showReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Process Return: {showReturn.name}</h3>
              <button onClick={() => setShowReturn(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleReturn} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Returned Condition</label>
                <select
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="New">New (Unchanged)</option>
                  <option value="Good">Good (Working fine)</option>
                  <option value="Fair">Fair (Minor wear & tear)</option>
                  <option value="Poor">Poor (Requires Maintenance)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReturn(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Category */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Add Asset Category</h3>
              <button onClick={() => setShowAddCategory(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Computing Hardware"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
