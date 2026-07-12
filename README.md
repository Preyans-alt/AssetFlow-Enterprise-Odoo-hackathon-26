# AssetFlow 🏢💼

**Odoo Hackathon Project — Enterprise Asset & Resource Management System**

AssetFlow is a lightweight, highly responsive, full-stack asset management application engineered for the **Odoo Hackathon**. Inspired by Odoo's modular design philosophy, AssetFlow serves as a modern, high-performance web alternative (or companion companion app) to Odoo's native Asset Management module. It is optimized for speed, intuitive real-time interactions, and flexible offline-first capabilities.

---

## 🏆 Hackathon Vision & Odoo Alignment

Odoo is known for its robust, integrated suite of business applications. AssetFlow aims to solve a key modern-day challenge: **providing frontline employees and technical field staff with an ultra-fast, zero-friction, mobile-friendly interface for asset operations** while maintaining high standards for audit compliance and system performance.

1. **Odoo Modular Principle**: Re-implements Odoo's key relational concepts (Departments, Users, Assets, Maintenance, and Audits) into a lightweight SPA with dynamic reactivity.
2. **Real-time Field Operations**: Designed with high-contrast UI, visual distribution bars, and quick-access tickets for on-the-field technicians who need to report damages or complete compliance cycles in seconds.
3. **Seamless Analytics**: Includes built-in interactive Recharts visualization that provides instant category allocations and percentage metrics without heavy BI-backend overhead.

---

## 🚀 Key Features

- 📊 **Dynamic Analytics Dashboard**: Visualizes asset counts, conditions, allocation trends, and real-time category distribution with premium donut charts showing percentage shares and color-coded visual bars.
- 📦 **Asset & Inventory Tracking**: Keep detailed logs of hardware/software, current allocation status, condition, serial numbers, locations, and asset tagging.
- 🏢 **Departmental Management**: Organize and structure assets by hierarchy, assigning direct responsibility to departments or specific team members.
- 📅 **Shared Resource Bookings**: A simple reservation scheduler where team members can secure bookable items (such as laptops, projectors, or vehicle pools) with start/end time validation.
- 🔧 **Support & Maintenance Log**: Submit and track technical repair requests/tickets, assign support technicians, and update maintenance state in real time.
- 🔍 **Inventory Auditing**: Conduct regular audits to verify asset states, flag lost/damaged assets, and maintain historical transaction logs.
- 🔒 **Secured Client & Server**: Fully protected by Firebase Authentication and custom authorization middleware.

---

## 🛠️ Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (Data Visualization), Motion (Layout animations).
- **Backend Server**: Node.js Express Server (with full TypeScript integration using `tsx`).
- **Database Layer**: Google Cloud Firestore (NoSQL Document Store).
- **Authentication**: Firebase Authentication.
- **Production Build System**: Bundled server using `esbuild` to support high performance and clean deployment paths.

---

## 💾 Firestore Database Collections

AssetFlow leverages **Firebase Firestore** with the following schema mappings:

| Collection Name | Purpose | Key Fields |
| :--- | :--- | :--- |
| `users` | User identity & organizational roles | `email`, `name`, `role`, `departmentId`, `status` |
| `departments` | Organizational tree representation | `name`, `headId`, `parentId`, `status` |
| `assets` | Core inventory details | `assetTag`, `categoryId`, `serialNumber`, `isBookable`, `status`, `condition` |
| `allocations` | Historic logs of asset ownership transfers | `assetId`, `allocatedToUser`, `allocatedBy`, `allocatedAt` |
| `bookings` | Future reservations for shared devices | `assetId`, `userId`, `startTime`, `endTime`, `status` |
| `maintenanceRequests` | Support tickets & malfunction reporting | `assetId`, `requestedBy`, `issueDescription`, `priority`, `status` |
| `auditCycles` | Scheduled compliance verification runs | `name`, `scope`, `startDate`, `endDate`, `status` |
| `auditResults` | Records of audited assets during a cycle | `auditCycleId`, `assetId`, `status` ('VERIFIED', 'DAMAGED', 'MISSING') |

---

## 🚦 Installation & Getting Started

### Prerequisites
Ensure you have **Node.js** installed on your server environment.

### 1. Initialize Configuration
Declare environment parameters in `.env` based on `.env.example`:
```bash
# General
PORT=3000
NODE_ENV=development

# Firebase Config (Shared securely or dynamically loaded)
FIREBASE_PROJECT_ID=...
```

### 2. Install Dependencies
Install all package manifests defined in `package.json`:
```bash
npm install
```

### 3. Start Development Server
Boot both Vite's asset compiler and the Express back-end seamlessly:
```bash
npm run dev
```

### 4. Build for Production
Bundle client-side assets and compile the back-end TypeScript server into a streamlined `dist/server.cjs` file:
```bash
npm run build
```

### 5. Run Production Build
Spawn the compiled production package directly:
```bash
npm start
```
