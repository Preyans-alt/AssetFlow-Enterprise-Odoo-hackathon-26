import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createServer as createHttpServer } from 'http';
import { Server } from 'socket.io';

// Import Routers
import authRoutes from './server/routes/authRoutes';
import departmentRoutes from './server/routes/departmentRoutes';
import assetRoutes from './server/routes/assetRoutes';
import bookingRoutes from './server/routes/bookingRoutes';
import maintenanceRoutes from './server/routes/maintenanceRoutes';
import auditRoutes from './server/routes/auditRoutes';
import dashboardRoutes from './server/routes/dashboardRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createHttpServer(app);
  
  // Set up Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
  });

  app.use(cors());
  app.use(express.json());

  // Attach io to req
  app.use((req, res, next) => {
    (req as any).io = io;
    next();
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/assets', assetRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/maintenance', maintenanceRoutes);
  app.use('/api/audit', auditRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // Basic API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AssetFlow API is running' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = await fs.promises.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
