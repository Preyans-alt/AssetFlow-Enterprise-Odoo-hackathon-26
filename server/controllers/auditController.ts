import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getAuditCycles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cycles = await prisma.auditCycle.findMany({
      include: {
        results: {
          include: {
            asset: { select: { id: true, name: true, assetTag: true } },
            auditor: { select: { id: true, name: true } },
          },
        },
      },
    });
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit cycles' });
  }
};

export const createAuditCycle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const cycle = await prisma.auditCycle.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'OPEN',
      },
    });

    res.status(201).json(cycle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit cycle' });
  }
};

export const submitAuditResult = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { auditCycleId, assetId, status, notes } = req.body;
    const auditedBy = req.user?.id;

    if (!auditCycleId || !assetId || !status || !auditedBy) {
      res.status(400).json({ error: 'Missing required audit result fields' });
      return;
    }

    // Check if result already exists under this cycle
    const existing = await prisma.auditResult.findFirst({
      where: { auditCycleId, assetId }
    });

    let result;
    if (existing) {
      result = await prisma.auditResult.update({
        where: { id: existing.id },
        data: {
          status,
          notes,
          auditedBy,
          auditedAt: new Date(),
        },
      });
    } else {
      result = await prisma.auditResult.create({
        data: {
          auditCycleId,
          assetId,
          status,
          notes,
          auditedBy,
        },
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Submit Audit Result Error:', error);
    res.status(500).json({ error: 'Failed to submit audit result' });
  }
};

export const closeAuditCycle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const cycle = await prisma.auditCycle.findUnique({
      where: { id },
      include: { results: true }
    });

    if (!cycle) {
      res.status(404).json({ error: 'Audit cycle not found' });
      return;
    }

    // Close the cycle
    const updatedCycle = await prisma.auditCycle.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    // Update asset statuses based on audit result findings:
    // If an asset is marked MISSING in a closed cycle, change its asset status to LOST
    for (const result of cycle.results) {
      if (result.status === 'MISSING') {
        await prisma.asset.update({
          where: { id: result.assetId },
          data: { status: 'LOST' },
        });
      }
    }

    res.json(updatedCycle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close audit cycle' });
  }
};
