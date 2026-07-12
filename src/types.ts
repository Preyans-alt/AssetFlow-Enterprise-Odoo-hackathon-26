export type Role = 'ADMIN' | 'ASSET_MANAGER' | 'DEPARTMENT_HEAD' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  departmentId?: string | null;
  department?: Department | null;
  status: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string | null;
  head?: User | null;
  parentId?: string | null;
  parent?: Department | null;
  status: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: {
    assets: number;
  };
}

export interface Asset {
  id: string;
  assetTag: string;
  categoryId: string;
  category?: Category;
  name: string;
  serialNumber?: string | null;
  acquisitionDate?: string | null;
  acquisitionCost?: number | null;
  condition?: string | null;
  location?: string | null;
  isBookable: boolean;
  status: 'AVAILABLE' | 'ALLOCATED' | 'RESERVED' | 'UNDER_MAINTENANCE' | 'LOST' | 'RETIRED' | 'DISPOSED';
  assignedToUser?: string | null;
  assignedToDept?: string | null;
  expectedReturn?: string | null;
}

export interface Booking {
  id: string;
  assetId: string;
  asset?: Asset;
  userId: string;
  user?: User;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  asset?: Asset;
  requestedBy: string;
  requester?: User;
  description: string;
  priority: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'RESOLVED';
  technicianId?: string | null;
  createdAt: string;
}

export interface AuditCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  results?: AuditResult[];
}

export interface AuditResult {
  id: string;
  auditCycleId: string;
  assetId: string;
  asset?: Asset;
  status: 'VERIFIED' | 'MISSING' | 'DAMAGED';
  notes?: string | null;
  auditedBy: string;
  auditor?: User;
  auditedAt: string;
}
