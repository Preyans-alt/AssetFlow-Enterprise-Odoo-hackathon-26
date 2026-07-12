import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

// --- CATEGORIES ---
export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.assetCategory.findMany({
      include: {
        _count: { select: { assets: true } }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
    const cat = await prisma.assetCategory.create({ data: { name } });
    res.status(201).json(cat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// --- ASSETS ---
export const getAssets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        category: true,
        bookings: { where: { status: 'UPCOMING' } }
      },
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

export const getAssetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        bookings: true,
        maintenance: true,
      }
    });
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

export const createAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      categoryId,
      serialNumber,
      acquisitionDate,
      acquisitionCost,
      condition,
      location,
      isBookable,
    } = req.body;

    if (!name || !categoryId) {
      res.status(400).json({ error: 'Asset name and categoryId are required' });
      return;
    }

    // Auto-generate Asset Tag e.g. AF-0001
    const count = await prisma.asset.count();
    const assetTag = `AF-${String(count + 1).padStart(4, '0')}`;

    const newAsset = await prisma.asset.create({
      data: {
        name,
        assetTag,
        categoryId,
        serialNumber: serialNumber || null,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
        acquisitionCost: acquisitionCost ? parseFloat(acquisitionCost) : null,
        condition: condition || 'New',
        location: location || 'Main Office',
        isBookable: isBookable || false,
        status: 'AVAILABLE',
      },
    });

    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Create Asset Error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        ...data,
        acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate) : undefined,
        acquisitionCost: data.acquisitionCost ? parseFloat(data.acquisitionCost) : undefined,
        expectedReturn: data.expectedReturn ? new Date(data.expectedReturn) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

export const allocateAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedToUser, assignedToDept, expectedReturn } = req.body;

    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    if (asset.status !== 'AVAILABLE') {
      res.status(400).json({ error: `Asset is currently ${asset.status.toLowerCase()}` });
      return;
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: 'ALLOCATED',
        assignedToUser: assignedToUser || null,
        assignedToDept: assignedToDept || null,
        expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Allocate Asset Error:', error);
    res.status(500).json({ error: 'Failed to allocate asset' });
  }
};

export const returnAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { condition } = req.body;

    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: 'AVAILABLE',
        assignedToUser: null,
        assignedToDept: null,
        expectedReturn: null,
        condition: condition || asset.condition,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to return asset' });
  }
};
