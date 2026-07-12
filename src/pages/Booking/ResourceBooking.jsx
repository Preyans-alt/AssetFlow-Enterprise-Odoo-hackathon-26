import React, { useState } from 'react';
import { CalendarDays, Clock, Plus, Users } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const ResourceBooking = () => {
  const { assets, bookings, currentUser, setBookings } = useAppContext();
  const [selectedResource, setSelectedResource] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter only bookable resources
  const bookableResources = assets.filter(a => a.isBookable);

  const handleBook = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedResource || !date || !startTime || !endTime) {
      setError('Please fill in all fields.');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    const startDateTime = `${date}T${startTime}`;
    const endDateTime = `${date}T${endTime}`;

    // Overlap validation
    const hasOverlap = bookings.some(b => {
      if (b.resource !== selectedResource || b.status === 'Cancelled') return false;
      const bStart = b.startTime;
      const bEnd = b.endTime;
      // Overlap condition: start1 < end2 && start2 < end1
      return startDateTime < bEnd && bStart < endDateTime;
    });

    if (hasOverlap) {
      setError('Booking rejected: The resource is already booked during this time slot.');
      return;
    }

    const newBooking = {
      id: Date.now(),
      resource: selectedResource,
      user: currentUser.name,
      startTime: startDateTime,
      endTime: endDateTime,
      status: 'Upcoming'
    };

    setBookings([...bookings, newBooking]);
    setSuccess('Resource booked successfully!');
    setSelectedResource('');
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resource Booking</h1>
          <p className="page-subtitle">Time-slot booking of shared resources with overlap validation.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-xl)' }}>
        {/* Booking Form */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <CalendarDays size={20} /> New Booking
          </h3>
          
          {error && <div className="badge-danger" style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', width: '100%', fontSize: '0.875rem' }}>{error}</div>}
          {success && <div className="badge-success" style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', width: '100%', fontSize: '0.875rem' }}>{success}</div>}
          
          <form onSubmit={handleBook}>
            <div className="form-group">
              <label>Select Resource</label>
              <select 
                className="input-field"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              >
                <option value="">-- Choose Resource --</option>
                {bookableResources.map(r => (
                  <option key={r.id} value={r.name}>{r.name} ({r.location})</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input 
                  type="time" 
                  className="input-field"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input 
                  type="time" 
                  className="input-field"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
              <Plus size={18} /> Confirm Booking
            </button>
          </form>
        </div>

        {/* Existing Bookings List */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>My Bookings & Schedule</h3>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 500 }}>{b.resource}</td>
                    <td>{b.user}</td>
                    <td><div className="flex-center" style={{ justifyContent: 'flex-start', gap: 'var(--space-xs)' }}><Clock size={14} color="var(--text-secondary)" /> {formatDateTime(b.startTime)}</div></td>
                    <td>{formatDateTime(b.endTime)}</td>
                    <td>
                      <span className={`status-badge ${
                        b.status === 'Completed' ? 'badge-neutral' : 
                        b.status === 'Ongoing' ? 'badge-success' : 'badge-info'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)' }}>No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceBooking;
