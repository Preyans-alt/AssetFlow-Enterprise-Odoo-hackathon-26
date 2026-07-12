import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data
  const initialUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@assetflow.com', department: 'IT', role: 'Employee', status: 'Active' },
    { id: 2, name: 'Raj Patel', email: 'raj@assetflow.com', department: 'Engineering', role: 'Employee', status: 'Active' },
    { id: 3, name: 'Amit Singh', email: 'amit@assetflow.com', department: 'IT', role: 'Asset Manager', status: 'Active' },
    { id: 4, name: 'Neha Gupta', email: 'neha@assetflow.com', department: 'HR', role: 'Department Head', status: 'Active' },
    { id: 5, name: 'Admin User', email: 'admin@assetflow.com', department: 'Management', role: 'Admin', status: 'Active' },
  ];

  const initialDepartments = [
    { id: 1, name: 'IT', head: 'Neha Gupta', status: 'Active' },
    { id: 2, name: 'Engineering', head: 'Vikram Mehta', status: 'Active' },
    { id: 3, name: 'HR', head: 'Pooja Desai', status: 'Active' },
  ];

  const initialCategories = [
    { id: 1, name: 'Electronics', description: 'Laptops, Monitors, Phones' },
    { id: 2, name: 'Furniture', description: 'Desks, Chairs, Cabinets' },
    { id: 3, name: 'Vehicles', description: 'Company cars, Vans' },
    { id: 4, name: 'Shared Resources', description: 'Meeting Rooms, Projectors' },
  ];

  const initialAssets = [
    { id: 'AF-0114', name: 'MacBook Pro M2', category: 'Electronics', condition: 'Good', location: 'HQ - 3rd Floor', status: 'Allocated', holder: 'Priya Sharma', expectedReturn: '2026-12-31' },
    { id: 'AF-0115', name: 'Dell XPS 15', category: 'Electronics', condition: 'Excellent', location: 'HQ - 3rd Floor', status: 'Available', holder: null, expectedReturn: null },
    { id: 'AF-0201', name: 'Ergonomic Chair', category: 'Furniture', condition: 'Good', location: 'HQ - 2nd Floor', status: 'Allocated', holder: 'Raj Patel', expectedReturn: null },
    { id: 'AF-0301', name: 'Delivery Van Ford', category: 'Vehicles', condition: 'Fair', location: 'Warehouse Parking', status: 'Under Maintenance', holder: null, expectedReturn: null },
    { id: 'AF-0401', name: 'Conference Room B2', category: 'Shared Resources', condition: 'Excellent', location: 'HQ - 1st Floor', status: 'Available', holder: null, expectedReturn: null, isBookable: true },
    { id: 'AF-0116', name: 'Lenovo ThinkPad', category: 'Electronics', condition: 'Poor', location: 'IT Storage', status: 'Retired', holder: null, expectedReturn: null },
    { id: 'AF-0117', name: 'iPad Pro', category: 'Electronics', condition: 'Good', location: 'HQ - 4th Floor', status: 'Allocated', holder: 'Amit Singh', expectedReturn: '2026-06-30' }, // Overdue return (if past 2026-06-30)
  ];

  const initialBookings = [
    { id: 1, resource: 'Conference Room B2', user: 'Raj Patel', startTime: '2026-07-12T09:00', endTime: '2026-07-12T10:00', status: 'Completed' },
    { id: 2, resource: 'Conference Room B2', user: 'Priya Sharma', startTime: '2026-07-13T14:00', endTime: '2026-07-13T15:30', status: 'Upcoming' },
  ];

  const initialMaintenance = [
    { id: 1, asset: 'AF-0301', issue: 'Engine knocking sound', priority: 'High', status: 'In Progress', reportedBy: 'Admin User', date: '2026-07-10' },
    { id: 2, asset: 'AF-0116', issue: 'Screen flickering', priority: 'Medium', status: 'Resolved', reportedBy: 'Priya Sharma', date: '2026-06-15' },
  ];

  // State
  const [currentUser, setCurrentUser] = useState(null); // null means not logged in
  const [users, setUsers] = useState(initialUsers);
  const [departments, setDepartments] = useState(initialDepartments);
  const [categories, setCategories] = useState(initialCategories);
  const [assets, setAssets] = useState(initialAssets);
  const [bookings, setBookings] = useState(initialBookings);
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Laptop AF-0117 return is overdue.', type: 'danger', read: false },
    { id: 2, message: 'New asset allocated: Ergonomic Chair.', type: 'info', read: true },
  ]);

  // Actions
  const login = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addAsset = (asset) => {
    setAssets([{ ...asset, id: `AF-${Math.floor(1000 + Math.random() * 9000)}` }, ...assets]);
  };

  const allocateAsset = (assetId, holder, date) => {
    setAssets(assets.map(a => a.id === assetId ? { ...a, status: 'Allocated', holder, expectedReturn: date } : a));
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      users, setUsers,
      departments, setDepartments,
      categories, setCategories,
      assets, setAssets, addAsset, allocateAsset,
      bookings, setBookings,
      maintenance, setMaintenance,
      notifications, setNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
