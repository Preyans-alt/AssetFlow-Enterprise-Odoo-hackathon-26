import { useEffect, useState } from 'react';
import { bookingAPI, assetAPI } from '../services/api';
import { Booking, Asset } from '../types';
import { Calendar, Clock, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookableAssets, setBookableAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [selectedAsset, setSelectedAsset] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [bookingList, assetList] = await Promise.all([
        bookingAPI.getBookings(),
        assetAPI.getAssets()
      ]);
      setBookings(bookingList);
      setBookableAssets(assetList.filter(a => a.isBookable && a.status === 'AVAILABLE'));
    } catch (error) {
      console.error('Failed to load bookings data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedAsset || !startDate || !startTime || !endDate || !endTime) {
      setError('Please fill in all scheduling fields.');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setError('The scheduled End Time must be after the Start Time.');
      return;
    }

    try {
      await bookingAPI.createBooking({
        assetId: selectedAsset,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      setSuccess('Resource scheduled and booked successfully!');
      setSelectedAsset('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'A scheduling conflict occurred. Please try another time slot.');
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id);
      loadData();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading schedules and reservations...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      {/* Scheduler Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Book a Shared Resource</h2>
        <p className="text-xs text-slate-500 mb-6">Schedule meeting rooms, projectors, or vehicle pools without overlaps.</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-sm mb-4 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl p-3 text-sm mb-4 flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleCreateBooking} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Shared Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">-- Choose Bookable Resource --</option>
              {bookableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.assetTag})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date & Time</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date & Time</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-semibold transition-all shadow-sm cursor-pointer mt-4"
          >
            Create Reservation
          </button>
        </form>
      </div>

      {/* Scheduler Calendar / Timeline list */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Active Schedules</h2>
        <p className="text-xs text-slate-500 mb-6">Upcoming and ongoing reservations across the organization.</p>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                  booking.status === 'CANCELLED' ? 'bg-slate-50 border-slate-100 opacity-60' :
                  'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    booking.status === 'CANCELLED' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{booking.asset?.name}</h4>
                    <p className="font-mono text-xs text-indigo-500 font-bold mt-0.5">{booking.asset?.assetTag}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Booked by: <span className="font-semibold text-slate-600">{booking.user?.name}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                    booking.status === 'UPCOMING' ? 'bg-indigo-50 text-indigo-700' :
                    booking.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-700' :
                    booking.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {booking.status}
                  </span>

                  {booking.status === 'UPCOMING' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Cancel Booking"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              No active reservations currently scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
