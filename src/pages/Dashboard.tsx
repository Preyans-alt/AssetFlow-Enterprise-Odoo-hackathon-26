import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Box, UserCheck, Wrench, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

const COLORS = [
  '#4f46e5', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f43f5e', // rose
  '#3b82f6', // blue
];

interface KPIState {
  totalAssets: number;
  activeAllocations: number;
  underMaintenance: number;
  totalBookings: number;
  categoryDistribution: { name: string; value: number }[];
  conditionDistribution: { name: string; value: number }[];
  overdueCount: number;
  overdueAssets: any[];
  recentTransactions: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<KPIState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKPIs = async () => {
    try {
      const res = await dashboardAPI.getKPIs();
      setData(res);
    } catch (error) {
      console.error('Failed to load dashboard KPIs', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchKPIs();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p>Loading performance statistics...</p>
      </div>
    );
  }

  const kpis = [
    { name: 'Total Registered Assets', value: data?.totalAssets || 0, icon: Box, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { name: 'Active Allocations', value: data?.activeAllocations || 0, icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Under Repair', value: data?.underMaintenance || 0, icon: Wrench, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Pending Resource Bookings', value: data?.totalBookings || 0, icon: Calendar, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-sm text-slate-500">Real-time enterprise resource utilization metrics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-700 text-sm font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overdue Warnings */}
      {data && data.overdueCount > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-800 text-sm">Overdue Return Warning!</h4>
            <p className="text-xs text-rose-700 mt-1">
              There are {data.overdueCount} assets that have exceeded their scheduled expected return dates:
            </p>
            <ul className="mt-2 space-y-1">
              {data.overdueAssets.map((asset) => (
                <li key={asset.id} className="text-xs text-rose-600 font-medium">
                  • {asset.name} ({asset.assetTag}) - Expected Return: {new Date(asset.expectedReturn).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${kpi.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.name}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Category Allocations</h3>
                <p className="text-xs text-slate-400">Distribution & percentage share of all resources</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold">
                {data?.categoryDistribution?.length || 0} Categories
              </span>
            </div>

            {data && data.categoryDistribution && data.categoryDistribution.length > 0 ? (
              (() => {
                const totalCategoryAssets = data.categoryDistribution.reduce((acc, curr) => acc + curr.value, 0);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Donut Chart Column */}
                    <div className="sm:col-span-5 relative h-64 w-full flex items-center justify-center">
                      <div className="absolute flex flex-col items-center justify-center pointer-events-none select-none z-10">
                        <span className="text-3xl font-extrabold text-slate-800">{totalCategoryAssets}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</span>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          {/* Elegant Underlay circle track for polished look */}
                          <Pie
                            data={[{ value: 100 }]}
                            cx="50%"
                            cy="50%"
                            innerRadius="62%"
                            outerRadius="82%"
                            fill="#f1f5f9"
                            dataKey="value"
                            isAnimationActive={false}
                            stroke="none"
                          />
                          <Pie
                            data={data.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius="62%"
                            outerRadius="82%"
                            paddingAngle={3}
                            dataKey="value"
                            stroke="#ffffff"
                            strokeWidth={3}
                          >
                            {data.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const entry = payload[0].payload;
                                const percentage = totalCategoryAssets > 0 
                                  ? ((entry.value / totalCategoryAssets) * 100).toFixed(1) 
                                  : '0';
                                return (
                                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs space-y-1 z-50">
                                    <p className="font-bold">{entry.name}</p>
                                    <div className="flex items-center gap-3 text-slate-300">
                                      <span>Count: <strong className="text-white">{entry.value}</strong></span>
                                      <span className="text-slate-500">|</span>
                                      <span>Share: <strong className="text-indigo-400">{percentage}%</strong></span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Categorical Breakdown List with Percentages & Bars */}
                    <div className="sm:col-span-7 space-y-3 max-h-64 overflow-y-auto pr-1">
                      {[...data.categoryDistribution]
                        .sort((a, b) => b.value - a.value)
                        .map((entry, idx) => {
                          const originalIndex = data.categoryDistribution.findIndex(item => item.name === entry.name);
                          const color = COLORS[originalIndex !== -1 ? originalIndex : idx % COLORS.length];
                          const percentage = totalCategoryAssets > 0 
                            ? ((entry.value / totalCategoryAssets) * 100).toFixed(1) 
                            : '0';
                          return (
                            <div key={entry.name} className="group p-1.5 hover:bg-slate-50 rounded-xl transition-all">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: color }} />
                                  <span className="font-semibold text-slate-700 truncate group-hover:text-slate-900">
                                    {entry.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className="text-slate-500 text-[11px]">{entry.value} pcs</span>
                                  <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              {/* Miniature visual progress bar */}
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000" 
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: color 
                                  }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                No categorical asset data available.
              </div>
            )}
          </div>
        </div>

        {/* Condition Assessment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-4">Quality & Condition Spread</h3>
          <div className="h-80">
            {data && data.conditionDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.conditionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} assets`, 'Count']} />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                    {data.conditionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No asset physical condition metrics.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-4">Recent Asset Updates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-4">Asset Name</th>
                <th className="pb-3">Asset Tag</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Location</th>
                <th className="pb-3 pr-4 text-right">Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {data && data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 text-sm transition-all">
                    <td className="py-4 pl-4 font-semibold text-slate-800">{tx.name}</td>
                    <td className="py-4 font-mono text-xs text-slate-500">{tx.assetTag}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        tx.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' :
                        tx.status === 'ALLOCATED' ? 'bg-indigo-50 text-indigo-700' :
                        tx.status === 'UNDER_MAINTENANCE' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{tx.location || 'N/A'}</td>
                    <td className="py-4 pr-4 text-right text-slate-400 text-xs">
                      {new Date(tx.updatedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    No recent activities recorded. Please register assets to begin track.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
