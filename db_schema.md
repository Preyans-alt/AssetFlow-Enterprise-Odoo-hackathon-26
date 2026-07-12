# AssetFlow Database Schema (Firestore)

Since the Cloud SQL developer quota for this environment was exhausted, we are using **Firebase Firestore** as the database. Firestore is a NoSQL document database. We will adapt the normalized structure to a NoSQL structure with appropriate collections and references.

## Collections

### `users`
- `id` (String): Document ID (matches Firebase Auth UID)
- `email` (String)
- `name` (String)
- `role` (String): 'ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'
- `departmentId` (String): Reference to departments collection
- `status` (String): 'ACTIVE', 'INACTIVE'
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### `departments`
- `id` (String)
- `name` (String)
- `headId` (String): Reference to users collection
- `parentId` (String, optional): Reference to departments collection for hierarchy
- `status` (String): 'ACTIVE', 'INACTIVE'
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### `assetCategories`
- `id` (String)
- `name` (String) // e.g., 'Electronics', 'Furniture'
- `customFields` (Map): e.g., `{ warrantyPeriod: 'number' }`
- `createdAt` (Timestamp)

### `assets`
- `id` (String)
- `assetTag` (String): Unique tag (e.g., AF-0001)
- `categoryId` (String)
- `name` (String)
- `serialNumber` (String)
- `acquisitionDate` (Timestamp)
- `acquisitionCost` (Number)
- `condition` (String)
- `location` (String)
- `isBookable` (Boolean): True for shared resources
- `status` (String): 'AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'
- `assignedToUser` (String, optional)
- `assignedToDepartment` (String, optional)
- `expectedReturnDate` (Timestamp, optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### `allocations` (History of allocations & transfers)
- `id` (String)
- `assetId` (String)
- `allocatedToUser` (String, optional)
- `allocatedToDepartment` (String, optional)
- `allocatedBy` (String)
- `allocatedAt` (Timestamp)
- `expectedReturnDate` (Timestamp, optional)
- `returnedAt` (Timestamp, optional)
- `returnCondition` (String, optional)
- `status` (String): 'ACTIVE', 'RETURNED', 'TRANSFER_REQUESTED', 'TRANSFERRED'

### `bookings` (For shared resources)
- `id` (String)
- `assetId` (String)
- `userId` (String)
- `startTime` (Timestamp)
- `endTime` (Timestamp)
- `status` (String): 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'
- `createdAt` (Timestamp)

### `maintenanceRequests`
- `id` (String)
- `assetId` (String)
- `requestedBy` (String)
- `issueDescription` (String)
- `priority` (String)
- `status` (String): 'PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'RESOLVED'
- `assignedTechnician` (String, optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### `auditCycles`
- `id` (String)
- `name` (String)
- `scope` (Map): `{ departmentId: string, location: string }`
- `startDate` (Timestamp)
- `endDate` (Timestamp)
- `status` (String): 'OPEN', 'CLOSED'
- `auditors` (Array of Strings): User IDs
- `createdAt` (Timestamp)

### `auditResults`
- `id` (String)
- `auditCycleId` (String)
- `assetId` (String)
- `status` (String): 'VERIFIED', 'MISSING', 'DAMAGED'
- `notes` (String)
- `auditedBy` (String)
- `auditedAt` (Timestamp)

### `notifications`
- `id` (String)
- `userId` (String)
- `title` (String)
- `message` (String)
- `type` (String) // 'BOOKING_REMINDER', 'OVERDUE_RETURN', 'MAINTENANCE_UPDATE'
- `read` (Boolean)
- `createdAt` (Timestamp)

### `activityLogs`
- `id` (String)
- `userId` (String)
- `action` (String)
- `entity` (String) // 'ASSET', 'USER', etc.
- `entityId` (String)
- `details` (String)
- `createdAt` (Timestamp)
