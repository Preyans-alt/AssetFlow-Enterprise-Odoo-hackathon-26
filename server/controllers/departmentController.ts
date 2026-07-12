import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        head: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, name: true } },
        employees: { select: { id: true, name: true } }
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, headId, parentId, status } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Department name is required' });
      return;
    }

    const dept = await prisma.department.create({
      data: {
        name,
        headId: headId || null,
        parentId: parentId || null,
        status: status || 'ACTIVE',
      },
    });

    res.status(201).json(dept);
  } catch (error) {
    console.error('Create Department Error:', error);
    res.status(500).json({ error: 'Failed to create department' });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, headId, parentId, status } = req.body;

    const updated = await prisma.department.update({
      where: { id },
      data: {
        name: name || undefined,
        headId: headId === null ? null : headId || undefined,
        parentId: parentId === null ? null : parentId || undefined,
        status: status || undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};
