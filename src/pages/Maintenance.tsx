import { useEffect, useState } from 'react';
import { maintenanceAPI, assetAPI } from '../services/api';
import { MaintenanceRequest, Asset } from '../types';
import { useAuth } from '../context/AuthContext';
import { Wrench, ShieldAlert, CheckCircle2, ClipboardList, HelpCircle } from 'lucide-react';

export default function Maintenance() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'ASSET_MANAGER';

  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedAsset, setSelectedAsset] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Feedback states
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [logError, setLogError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  // Technician assignment
  const [assignTechId, setAssignTechId] = useState('');

  const loadData = async () => {
    try {
      const [requestList, assetList] = await Promise.all([
        maintenanceAPI.getRequests(),
        assetAPI.getAssets()
      ]);
      setRequests(requestList);
      setAssets(assetList.filter(a => a.status === 'AVAILABLE' || a.status === 'ALLOCATED'));
    } catch (error) {
      console.error('Failed to load maintenance requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!selectedAsset) {
      setFormError('Please select the affected asset.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please describe the issue you are experiencing.');
      return;
    }

    try {
      await maintenanceAPI.createRequest({
        assetId: selectedAsset,
        description: description.trim(),
        priority: priority.toUpperCase(),
      });
      setSelectedAsset('');
      setDescription('');
      setPriority('Medium');
      setFormSuccess('Support ticket created successfully! Tech support will review it shortly.');
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(null);
      }, 5000);

      loadData();
    } catch (error: any) {
      console.error('Failed to submit request', error);
      setFormError(error.response?.data?.error || 'Failed to submit maintenance request. Please try again.');
    }
  };

  const handleUpdateStatus = async (id: string, status: string, techId: string | null = null) => {
    setLogError(null);
    setLogSuccess(null);
    try {
      await maintenanceAPI.updateRequestStatus(id, { status, technicianId: techId });
      setLogSuccess(`Ticket status updated to ${status} successfully!`);
      
      setTimeout(() => {
        setLogSuccess(null);
      }, 5000);

      loadData();
    } catch (error: any) {
      console.error('Failed to update request state', error);
      setLogError(error.response?.data?.error || 'Failed to update maintenance state.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading maintenance ticket office...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      {/* Ticket form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Raise Support Ticket</h2>
        <p className="text-xs text-slate-500 mb-6">Report damaged, broken, or malfunctioning assets for technical support.</p>

        {/* Form Notifications */}
        {formSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Affected Asset</label>
            <select
              required
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">-- Select Asset --</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.assetTag})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Issue Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Battery is swelling, keyboard keys are double-typing..."
              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="Low">Low (General Maintenance)</option>
              <option value="Medium">Medium (Regular Issue)</option>
              <option value="High">High (Disrupts workflow)</option>
              <option value="Critical">Critical (Immediate danger)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer mt-4"
          >
            Submit Support Request
          </button>
        </form>
      </div>

      {/* Ticket List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Repair & Support Log</h2>
        <p className="text-xs text-slate-500 mb-6">Track active hardware repairs and tech support tickets.</p>

        {/* Log Notifications */}
        {logSuccess && (
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping flex-shrink-0" />
            <span>{logSuccess}</span>
          </div>
        )}

        {logError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 flex-shrink-0 animate-pulse" />
            <span>{logError}</span>
          </div>
        )}

        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm flex flex-col gap-4 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      req.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm">{req.asset?.name}</h4>
                        <span className="font-mono text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {req.asset?.assetTag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                        "{req.description}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      req.priority?.toUpperCase() === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      req.priority?.toUpperCase() === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                      req.priority?.toUpperCase() === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {req.priority}
                    </span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                      req.status === 'PENDING' ? 'bg-slate-100 text-slate-600' :
                      req.status === 'APPROVED' ? 'bg-indigo-50 text-indigo-700' :
                      req.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                      req.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Workflow Action Panel */}
                <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Raised by: <span className="font-semibold text-slate-600">{req.requester?.name || 'Unknown'}</span> •{' '}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>

                  {isAdminOrManager && req.status !== 'RESOLVED' && req.status !== 'REJECTED' && (
                    <div className="flex items-center gap-2">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {req.status === 'APPROVED' && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter Technician ID/Name"
                            onChange={(e) => setAssignTechId(e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'IN_PROGRESS', assignTechId || 'Tech Support')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Start Repair
                          </button>
                        </div>
                      )}

                      {req.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'RESOLVED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolve & Restore
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No repairs or support tickets logged currently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
