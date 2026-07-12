import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getMaintenanceRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      include: {
        asset: { select: { id: true, name: true, assetTag: true, status: true } },
        requester: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
};

export const createMaintenanceRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assetId, description, priority } = req.body;
    const requestedBy = req.user?.id;

    if (!assetId || !description || !priority || !requestedBy) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        assetId,
        requestedBy,
        description,
        priority,
        status: 'PENDING',
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create Maintenance Error:', error);
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
};

export const updateMaintenanceStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, technicianId } = req.body;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true }
    });

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        technicianId: technicianId || undefined,
      },
    });

    // Workflow asset state transitions:
    // 1. When approved, asset status changes to UNDER_MAINTENANCE
    if (status === 'APPROVED' || status === 'IN_PROGRESS') {
      await prisma.asset.update({
        where: { id: request.assetId },
        data: { status: 'UNDER_MAINTENANCE' },
      });
    }

    // 2. When resolved, asset status changes back to AVAILABLE
    if (status === 'RESOLVED') {
      await prisma.asset.update({
        where: { id: request.assetId },
        data: { status: 'AVAILABLE' },
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update Maintenance Status Error:', error);
    res.status(500).json({ error: 'Failed to update maintenance status' });
  }
};
