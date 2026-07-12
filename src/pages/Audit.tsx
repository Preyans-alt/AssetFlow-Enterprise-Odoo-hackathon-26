import { useEffect, useState } from 'react';
import { auditAPI, assetAPI } from '../services/api';
import { AuditCycle, Asset } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, HelpCircle, Lock } from 'lucide-react';

export default function Audit() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showAddCycle, setShowAddCycle] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleStart, setNewCycleStart] = useState('');
  const [newCycleEnd, setNewCycleEnd] = useState('');

  // Submit Result
  const [selectedCycleId, setSelectedCycleId] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [auditStatus, setAuditStatus] = useState('VERIFIED');
  const [auditNotes, setAuditNotes] = useState('');

  const loadData = async () => {
    try {
      const [cycleList, assetList] = await Promise.all([
        auditAPI.getCycles(),
        assetAPI.getAssets()
      ]);
      setCycles(cycleList);
      setAssets(assetList);
      if (cycleList.length > 0) {
        const openCycle = cycleList.find(c => c.status === 'OPEN');
        if (openCycle) setSelectedCycleId(openCycle.id);
      }
    } catch (error) {
      console.error('Failed to load audit cycles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCycleName || !newCycleStart || !newCycleEnd) {
      alert('Please fill out all cycle parameters.');
      return;
    }
    try {
      await auditAPI.createCycle({
        name: newCycleName,
        startDate: newCycleStart,
        endDate: newCycleEnd,
      });
      setShowAddCycle(false);
      setNewCycleName('');
      setNewCycleStart('');
      setNewCycleEnd('');
      loadData();
    } catch (error) {
      alert('Failed to initiate audit cycle');
    }
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCycleId || !selectedAssetId || !auditStatus) {
      alert('Please fill out all auditing inputs.');
      return;
    }
    try {
      await auditAPI.submitResult({
        auditCycleId: selectedCycleId,
        assetId: selectedAssetId,
        status: auditStatus,
        notes: auditNotes,
      });
      setSelectedAssetId('');
      setAuditNotes('');
      loadData();
    } catch (error) {
      alert('Failed to record verification logs');
    }
  };

  const handleCloseCycle = async (id: string) => {
    if (!confirm('Are you sure you want to close this audit cycle? Closing will automatically update missing assets status to LOST in the registry and lock the audit record.')) return;
    try {
      await auditAPI.closeCycle(id);
      loadData();
    } catch (error) {
      alert('Failed to close audit cycle');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading audit consoles...</div>;
  }

  const activeCycle = cycles.find(c => c.status === 'OPEN');

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Audits</h1>
          <p className="text-sm text-slate-500">Scheduled asset verification cycles and status auditing</p>
        </div>
        {isAdminOrManager && !activeCycle && (
          <button
            onClick={() => setShowAddCycle(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Audit Cycle
          </button>
        )}
      </div>

      {/* Audit Action Hub (Only shown when there's an open cycle) */}
      {activeCycle ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Auditor Logging Console */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 bg-indigo-50/5 shadow-sm self-start">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-bold text-lg">Auditor Console</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">Verify physical assets for cycle: <strong>{activeCycle.name}</strong></p>

            <form onSubmit={handleSubmitResult} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Asset to Verify</label>
                <select
                  required
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">-- Choose Asset --</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.assetTag}) - Current: {asset.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Verification Findings</label>
                <select
                  value={auditStatus}
                  onChange={(e) => setAuditStatus(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="VERIFIED">Verified (Found & Healthy)</option>
                  <option value="MISSING">Missing (Not located)</option>
                  <option value="DAMAGED">Damaged (Needs repair)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes / Discrepancy details</label>
                <textarea
                  rows={3}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="Minor scratches, located in Cabin B, unable to locate in cabinet..."
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer mt-4"
              >
                Submit Verification Record
              </button>
            </form>
          </div>

          {/* Results table under current cycle */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg">Active Audit: {activeCycle.name}</h3>
              {isAdminOrManager && (
                <button
                  onClick={() => handleCloseCycle(activeCycle.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Close & Lock Audit
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Duration: {new Date(activeCycle.startDate).toLocaleDateString()} to {new Date(activeCycle.endDate).toLocaleDateString()}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Asset</th>
                    <th className="pb-3">Tag</th>
                    <th className="pb-3">Audit Finding</th>
                    <th className="pb-3">Log Notes</th>
                    <th className="pb-3 pr-2 text-right">Auditor</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCycle.results && activeCycle.results.length > 0 ? (
                    activeCycle.results.map((result) => (
                      <tr key={result.id} className="border-b border-slate-50 hover:bg-slate-50 text-sm transition-all">
                        <td className="py-4 pl-2 font-semibold text-slate-800">{result.asset?.name}</td>
                        <td className="py-4 font-mono text-xs text-slate-500">{result.asset?.assetTag}</td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                            result.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' :
                            result.status === 'MISSING' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {result.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500 italic max-w-xs truncate" title={result.notes || ''}>
                          {result.notes || 'No notes logged'}
                        </td>
                        <td className="py-4 pr-2 text-right text-slate-500 font-medium">
                          {result.auditor?.name || 'Staff'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                        No asset verifications logged for this cycle yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 max-w-2xl mx-auto">
          <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <h4 className="font-bold text-slate-900 text-lg mb-2">No Active Audit Cycle</h4>
          <p className="text-sm mb-6">
            Auditing verifications can only be conducted when there is an active audit cycle opened by system administrators or asset managers.
          </p>
          {isAdminOrManager && (
            <button
              onClick={() => setShowAddCycle(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Start New Cycle
            </button>
          )}
        </div>
      )}

      {/* Historical audits */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-4">Historical Audit Cycles</h3>
        <div className="space-y-4">
          {cycles.filter(c => c.status === 'CLOSED').length > 0 ? (
            cycles.filter(c => c.status === 'CLOSED').map((cycle) => (
              <div key={cycle.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{cycle.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Conducted: {new Date(cycle.startDate).toLocaleDateString()} to {new Date(cycle.endDate).toLocaleDateString()} • Locked
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    {cycle.results?.length || 0} verifications performed
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No historical locked cycles found.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Initiate Audit Cycle */}
      {showAddCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Initiate Audit Cycle</h3>
              <button onClick={() => setShowAddCycle(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">×</button>
            </div>
            <form onSubmit={handleCreateCycle} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                  placeholder="Q3 Hardware Verification Audit"
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={newCycleStart}
                  onChange={(e) => setNewCycleStart(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={newCycleEnd}
                  onChange={(e) => setNewCycleEnd(e.target.value)}
                  className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCycle(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Start Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
