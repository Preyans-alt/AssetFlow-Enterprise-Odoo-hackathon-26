import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding database...');

  // 1. Clean existing records in reverse order of foreign key relationships
  console.log('Cleaning existing database records...');
  try {
    await prisma.auditResult.deleteMany({});
    await prisma.auditCycle.deleteMany({});
    await prisma.maintenanceRequest.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.asset.deleteMany({});
    await prisma.assetCategory.deleteMany({});
    
    // Resolve circular references between User and Department
    await prisma.user.updateMany({ data: { departmentId: null } });
    await prisma.department.updateMany({ data: { headId: null, parentId: null } });
    
    await prisma.user.deleteMany({});
    await prisma.department.deleteMany({});
    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  }

  // 2. Hash default password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 3. Create 10 Departments
  console.log('Seeding Departments...');
  const departmentsData = [
    { name: 'Executive Suite', status: 'ACTIVE' },
    { name: 'Human Resources', status: 'ACTIVE' },
    { name: 'Information Technology', status: 'ACTIVE' },
    { name: 'Finance & Accounting', status: 'ACTIVE' },
    { name: 'Legal & Compliance', status: 'ACTIVE' },
    { name: 'Research & Development', status: 'ACTIVE' },
    { name: 'Marketing & Communications', status: 'ACTIVE' },
    { name: 'Sales & Business Development', status: 'ACTIVE' },
    { name: 'Operations & Logistics', status: 'ACTIVE' },
    { name: 'Customer Success', status: 'ACTIVE' },
  ];

  const departments = [];
  for (const dept of departmentsData) {
    const createdDept = await prisma.department.create({ data: dept });
    departments.push(createdDept);
  }

  // Set up parent-child relationships for nested departments
  // R&D and IT under Executive, Marketing and Sales under Sales & Business Development
  await prisma.department.update({
    where: { id: departments[2].id }, // IT
    data: { parentId: departments[0].id }, // Executive
  });
  await prisma.department.update({
    where: { id: departments[5].id }, // R&D
    data: { parentId: departments[0].id }, // Executive
  });
  await prisma.department.update({
    where: { id: departments[6].id }, // Marketing
    data: { parentId: departments[7].id }, // Sales & Business Dev
  });

  // 4. Create 10 Users
  console.log('Seeding Users...');
  const usersData = [
    {
      email: 'sarah.j@assetflow.com',
      password: hashedPassword,
      name: 'Sarah Jenkins',
      role: 'ADMIN',
      status: 'ACTIVE',
      departmentId: departments[0].id, // Executive Suite
    },
    {
      email: 'michael.c@assetflow.com',
      password: hashedPassword,
      name: 'Michael Chen',
      role: 'ASSET_MANAGER',
      status: 'ACTIVE',
      departmentId: departments[2].id, // IT
    },
    {
      email: 'emily.r@assetflow.com',
      password: hashedPassword,
      name: 'Emily Rodriguez',
      role: 'DEPARTMENT_HEAD',
      status: 'ACTIVE',
      departmentId: departments[1].id, // HR
    },
    {
      email: 'david.k@assetflow.com',
      password: hashedPassword,
      name: 'David Kim',
      role: 'DEPARTMENT_HEAD',
      status: 'ACTIVE',
      departmentId: departments[5].id, // R&D
    },
    {
      email: 'james.w@assetflow.com',
      password: hashedPassword,
      name: 'James Wilson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[2].id, // IT
    },
    {
      email: 'jessica.t@assetflow.com',
      password: hashedPassword,
      name: 'Jessica Taylor',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[6].id, // Marketing
    },
    {
      email: 'robert.m@assetflow.com',
      password: hashedPassword,
      name: 'Robert Martinez',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[7].id, // Sales
    },
    {
      email: 'amanda.t@assetflow.com',
      password: hashedPassword,
      name: 'Amanda Thomas',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[3].id, // Finance
    },
    {
      email: 'william.a@assetflow.com',
      password: hashedPassword,
      name: 'William Anderson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[5].id, // R&D
    },
    {
      email: 'ashley.j@assetflow.com',
      password: hashedPassword,
      name: 'Ashley Jackson',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      departmentId: departments[9].id, // Customer Success
    },
  ];

  const users = [];
  for (const u of usersData) {
    const createdUser = await prisma.user.create({ data: u });
    users.push(createdUser);
  }

  // Update Department heads
  await prisma.department.update({
    where: { id: departments[0].id }, // Executive Suite
    data: { headId: users[0].id }, // Sarah Jenkins
  });
  await prisma.department.update({
    where: { id: departments[1].id }, // HR
    data: { headId: users[2].id }, // Emily Rodriguez
  });
  await prisma.department.update({
    where: { id: departments[5].id }, // R&D
    data: { headId: users[3].id }, // David Kim
  });

  // 5. Create 10 Asset Categories
  console.log('Seeding Asset Categories...');
  const categoriesData = [
    { name: 'Laptops & Notebooks' },
    { name: 'Desktop Workstations' },
    { name: 'Monitors & Displays' },
    { name: 'Mobile Phones' },
    { name: 'Tablet Devices' },
    { name: 'Networking Hardware' },
    { name: 'Server Equipment' },
    { name: 'Office Printers & Scanners' },
    { name: 'Smart Meeting AV' },
    { name: 'Ergonomic Office Furniture' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.assetCategory.create({ data: cat });
    categories.push(createdCat);
  }

  // 6. Create 10 Assets
  console.log('Seeding Assets...');
  const assetsData = [
    {
      assetTag: 'AST-2026-001',
      categoryId: categories[0].id, // Laptops
      name: 'Apple MacBook Pro 16" M3 Max',
      serialNumber: 'C02F1234MD6M',
      acquisitionDate: new Date('2026-01-15'),
      acquisitionCost: 3499.00,
      condition: 'Excellent',
      location: 'Executive Suite',
      isBookable: false,
      status: 'ALLOCATED',
      assignedToUser: users[0].id, // Sarah Jenkins
    },
    {
      assetTag: 'AST-2026-002',
      categoryId: categories[0].id, // Laptops
      name: 'Dell XPS 15 9530',
      serialNumber: 'DY2H8901JK4L',
      acquisitionDate: new Date('2026-02-10'),
      acquisitionCost: 2199.99,
      condition: 'Good',
      location: 'R&D Lab',
      isBookable: true,
      status: 'AVAILABLE',
    },
    {
      assetTag: 'AST-2026-003',
      categoryId: categories[0].id, // Laptops
      name: 'Lenovo ThinkPad T14 Gen 4',
      serialNumber: 'PF3A7890QR3S',
      acquisitionDate: new Date('2026-03-01'),
      acquisitionCost: 1450.00,
      condition: 'New',
      location: 'HR Department',
      isBookable: true,
      status: 'ALLOCATED',
      assignedToUser: users[2].id, // Emily Rodriguez
    },
    {
      assetTag: 'AST-2026-004',
      categoryId: categories[3].id, // Mobile Phones
      name: 'Apple iPhone 15 Pro Max 512GB',
      serialNumber: 'DN5K1122ZZ8X',
      acquisitionDate: new Date('2026-01-20'),
      acquisitionCost: 1399.00,
      condition: 'Excellent',
      location: 'Sales Office',
      isBookable: true,
      status: 'RESERVED',
    },
    {
      assetTag: 'AST-2026-005',
      categoryId: categories[2].id, // Monitors
      name: 'LG UltraFine 32" 4K Display',
      serialNumber: 'LG32U880B123',
      acquisitionDate: new Date('2026-01-18'),
      acquisitionCost: 799.00,
      condition: 'Good',
      location: 'Executive Suite',
      isBookable: false,
      status: 'ALLOCATED',
      assignedToUser: users[3].id, // David Kim
    },
    {
      assetTag: 'AST-2026-006',
      categoryId: categories[4].id, // Tablets
      name: 'Apple iPad Pro 12.9" M2 256GB',
      serialNumber: 'MP12.9M2ABCDE',
      acquisitionDate: new Date('2026-04-05'),
      acquisitionCost: 1099.00,
      condition: 'New',
      location: 'Marketing Suite',
      isBookable: true,
      status: 'AVAILABLE',
    },
    {
      assetTag: 'AST-2026-007',
      categoryId: categories[5].id, // Networking
      name: 'Ubiquiti UniFi Dream Machine Pro',
      serialNumber: 'UDMP-9988-7766',
      acquisitionDate: new Date('2025-11-12'),
      acquisitionCost: 379.00,
      condition: 'Excellent',
      location: 'Server Room A',
      isBookable: false,
      status: 'AVAILABLE',
    },
    {
      assetTag: 'AST-2026-008',
      categoryId: categories[6].id, // Servers
      name: 'Dell PowerEdge R760 Server',
      serialNumber: 'PE-R760-SERVER-1',
      acquisitionDate: new Date('2025-10-01'),
      acquisitionCost: 8950.00,
      condition: 'Excellent',
      location: 'Server Room B',
      isBookable: false,
      status: 'UNDER_MAINTENANCE',
    },
    {
      assetTag: 'AST-2026-009',
      categoryId: categories[7].id, // Printers
      name: 'HP LaserJet Enterprise MFP M528dn',
      serialNumber: 'HP-MFP-M528-987',
      acquisitionDate: new Date('2025-05-15'),
      acquisitionCost: 1250.00,
      condition: 'Fair',
      location: 'Floor 2 Copy Center',
      isBookable: false,
      status: 'AVAILABLE',
    },
    {
      assetTag: 'AST-2026-010',
      categoryId: categories[9].id, // Furniture
      name: 'Steelcase Gesture Ergonomic Chair',
      serialNumber: 'SC-GESTURE-CHAIR-44',
      acquisitionDate: new Date('2025-08-22'),
      acquisitionCost: 1150.00,
      condition: 'Good',
      location: 'Sales Cubicle 4B',
      isBookable: false,
      status: 'ALLOCATED',
      assignedToUser: users[7].id, // Amanda Thomas
    },
  ];

  const assets = [];
  for (const asset of assetsData) {
    const createdAsset = await prisma.asset.create({ data: asset });
    assets.push(createdAsset);
  }

  // 7. Create 10 Bookings
  console.log('Seeding Bookings...');
  const baseDate = new Date();
  
  const bookingsData = [
    {
      assetId: assets[1].id, // Dell XPS 15 (AVAILABLE/Bookable)
      userId: users[4].id, // James Wilson
      startTime: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000), // Started 1 day ago
      endTime: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000), // Ends tomorrow
      status: 'ONGOING',
    },
    {
      assetId: assets[5].id, // Apple iPad Pro (AVAILABLE/Bookable)
      userId: users[5].id, // Jessica Taylor
      startTime: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      endTime: new Date(baseDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
    {
      assetId: assets[3].id, // Apple iPhone 15 Pro Max (RESERVED)
      userId: users[6].id, // Robert Martinez
      startTime: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000), // In 12 hours
      endTime: new Date(baseDate.getTime() + 36 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
    {
      assetId: assets[1].id, // Dell XPS 15
      userId: users[8].id, // William Anderson
      startTime: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endTime: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
    },
    {
      assetId: assets[2].id, // Lenovo ThinkPad T14
      userId: users[9].id, // Ashley Jackson
      startTime: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      endTime: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: 'CANCELLED',
    },
    {
      assetId: assets[5].id, // Apple iPad Pro
      userId: users[0].id, // Sarah Jenkins
      startTime: new Date(baseDate.getTime() - 15 * 24 * 60 * 60 * 1000),
      endTime: new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
    },
    {
      assetId: assets[1].id, // Dell XPS 15
      userId: users[7].id, // Amanda Thomas
      startTime: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // In 7 days
      endTime: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
    {
      assetId: assets[2].id, // Lenovo ThinkPad T14
      userId: users[4].id, // James Wilson
      startTime: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000), // In 14 days
      endTime: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
    {
      assetId: assets[3].id, // Apple iPhone 15 Pro Max
      userId: users[9].id, // Ashley Jackson
      startTime: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      status: 'COMPLETED',
    },
    {
      assetId: assets[5].id, // Apple iPad Pro
      userId: users[8].id, // William Anderson
      startTime: new Date(baseDate.getTime() + 20 * 24 * 60 * 60 * 1000),
      endTime: new Date(baseDate.getTime() + 25 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
  ];

  for (const booking of bookingsData) {
    await prisma.booking.create({ data: booking });
  }

  // 8. Create 10 Maintenance Requests
  console.log('Seeding Maintenance Requests...');
  const maintenanceRequestsData = [
    {
      assetId: assets[7].id, // Dell PowerEdge Server (UNDER_MAINTENANCE)
      requestedBy: users[1].id, // Michael Chen (Asset Manager)
      description: 'Primary disk drive failure on RAID array. Needs hot-swap drive replacement.',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      technicianId: users[1].id,
    },
    {
      assetId: assets[8].id, // HP LaserJet Printer
      requestedBy: users[4].id, // James Wilson
      description: 'Repeated double-feeding jam errors on Tray 2. Rollers likely need cleaning or replacing.',
      priority: 'MEDIUM',
      status: 'PENDING',
    },
    {
      assetId: assets[4].id, // LG 32" Display
      requestedBy: users[3].id, // David Kim
      description: 'Flickering display output and failing power delivery when using USB-C cable.',
      priority: 'HIGH',
      status: 'APPROVED',
      technicianId: users[1].id,
    },
    {
      assetId: assets[0].id, // MacBook Pro M3
      requestedBy: users[0].id, // Sarah Jenkins
      description: 'Spilled coffee over trackpad. Trackpad button click is unresponsive.',
      priority: 'HIGH',
      status: 'RESOLVED',
      technicianId: users[1].id,
    },
    {
      assetId: assets[1].id, // Dell XPS 15
      requestedBy: users[8].id, // William Anderson
      description: 'Wants upgraded 32GB RAM module installed for heavy development VMs.',
      priority: 'LOW',
      status: 'REJECTED',
    },
    {
      assetId: assets[9].id, // Steelcase Chair
      requestedBy: users[7].id, // Amanda Thomas
      description: 'Pneumatic cylinder height adjustment is loose and drops under load.',
      priority: 'LOW',
      status: 'PENDING',
    },
    {
      assetId: assets[6].id, // Ubiquiti Dream Machine
      requestedBy: users[1].id, // Michael Chen
      description: 'Periodic WAN connection drops. Needs dynamic firmware patch testing.',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      technicianId: users[1].id,
    },
    {
      assetId: assets[2].id, // Lenovo ThinkPad T14
      requestedBy: users[2].id, // Emily Rodriguez
      description: 'Broken physical plastic latch on the battery bay slider.',
      priority: 'LOW',
      status: 'PENDING',
    },
    {
      assetId: assets[5].id, // Apple iPad Pro
      requestedBy: users[5].id, // Jessica Taylor
      description: 'Cracked glass screen near bottom left bezel. Touch interface still functional.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      technicianId: users[1].id,
    },
    {
      assetId: assets[3].id, // Apple iPhone 15
      requestedBy: users[6].id, // Robert Martinez
      description: 'Camera lens protective glass is scratched, causing lens flare in sunny conditions.',
      priority: 'MEDIUM',
      status: 'APPROVED',
    },
  ];

  for (const req of maintenanceRequestsData) {
    await prisma.maintenanceRequest.create({ data: req });
  }

  // 9. Create 10 Audit Cycles
  console.log('Seeding Audit Cycles...');
  const auditCyclesData = [
    {
      name: 'FY2024 End-of-Year Audit',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      status: 'CLOSED',
    },
    {
      name: 'Q1 2025 Laptop Audit',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-02-28'),
      status: 'CLOSED',
    },
    {
      name: 'Mid-Year Infrastructure Audit 2025',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-15'),
      status: 'CLOSED',
    },
    {
      name: 'Q3 2025 Hardware Audit',
      startDate: new Date('2025-09-10'),
      endDate: new Date('2025-09-25'),
      status: 'CLOSED',
    },
    {
      name: 'Q4 2025 Electronics Audit',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-15'),
      status: 'CLOSED',
    },
    {
      name: 'Spring IT Equipment Audit 2026',
      startDate: new Date('2026-03-05'),
      endDate: new Date('2026-03-20'),
      status: 'CLOSED',
    },
    {
      name: 'Q2 2026 Asset Inventory',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-25'),
      status: 'CLOSED',
    },
    {
      name: 'Emergency Security Hardware Check',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-05'),
      status: 'CLOSED',
    },
    {
      name: 'Summer 2026 Office Furniture Audit',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-15'),
      status: 'OPEN',
    },
    {
      name: 'Active Q3 2026 Asset Verification',
      startDate: new Date('2026-07-10'),
      endDate: new Date('2026-08-10'),
      status: 'OPEN',
    },
  ];

  const auditCycles = [];
  for (const cycle of auditCyclesData) {
    const createdCycle = await prisma.auditCycle.create({ data: cycle });
    auditCycles.push(createdCycle);
  }

  // 10. Create 10 Audit Results
  console.log('Seeding Audit Results...');
  const auditResultsData = [
    {
      auditCycleId: auditCycles[9].id, // Active Q3 2026
      assetId: assets[0].id, // MacBook Pro M3
      status: 'VERIFIED',
      notes: 'Asset verified on Sarah Jenkins desk. Device is in excellent operational state.',
      auditedBy: users[1].id, // Michael Chen (Asset Manager)
    },
    {
      auditCycleId: auditCycles[9].id, // Active Q3 2026
      assetId: assets[2].id, // Lenovo ThinkPad
      status: 'VERIFIED',
      notes: 'Asset verified with Emily Rodriguez. Outer chassis shows micro scratches.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[9].id, // Active Q3 2026
      assetId: assets[4].id, // LG 32 Monitor
      status: 'VERIFIED',
      notes: 'Verified in Executive Office. Power-delivery issue noted (requires maintenance).',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[9].id, // Active Q3 2026
      assetId: assets[3].id, // iPhone 15 Pro Max
      status: 'VERIFIED',
      notes: 'Verified in Sales Office. Screen guard is cracked but display is fine.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[9].id, // Active Q3 2026
      assetId: assets[1].id, // Dell XPS 15
      status: 'VERIFIED',
      notes: 'Verified in R&D Lab. System is clean and active.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[8].id, // Summer 2026 Office Furniture Audit
      assetId: assets[9].id, // Steelcase Chair
      status: 'DAMAGED',
      notes: 'Pneumatic height cylinder drops randomly under standard load. Needs repair.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[7].id, // Emergency Hardware Check
      assetId: assets[6].id, // Ubiquiti Dream Machine
      status: 'VERIFIED',
      notes: 'Successfully located in Server Room rack. Firmware patched to latest release.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[6].id, // Q2 2026 Asset Inventory
      assetId: assets[7].id, // Dell PowerEdge Server
      status: 'VERIFIED',
      notes: 'Server located in Server Room B. Operational and cool.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[6].id, // Q2 2026 Asset Inventory
      assetId: assets[8].id, // HP LaserJet Printer
      status: 'VERIFIED',
      notes: 'Located in second-floor print bay. Toner is at 45%. Roller replacement pending.',
      auditedBy: users[1].id,
    },
    {
      auditCycleId: auditCycles[5].id, // Spring IT Audit 2026
      assetId: assets[5].id, // iPad Pro
      status: 'DAMAGED',
      notes: 'iPad located. Bottom-left glass panel is cracked. Touch operations are functional.',
      auditedBy: users[1].id,
    },
  ];

  for (const res of auditResultsData) {
    await prisma.auditResult.create({ data: res });
  }

  console.log('Seeding completed successfully!');
  console.log(`Summary of entries created:
  - Departments: ${await prisma.department.count()}
  - Users: ${await prisma.user.count()}
  - Asset Categories: ${await prisma.assetCategory.count()}
  - Assets: ${await prisma.asset.count()}
  - Bookings: ${await prisma.booking.count()}
  - Maintenance Requests: ${await prisma.maintenanceRequest.count()}
  - Audit Cycles: ${await prisma.auditCycle.count()}
  - Audit Results: ${await prisma.auditResult.count()}
  `);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
