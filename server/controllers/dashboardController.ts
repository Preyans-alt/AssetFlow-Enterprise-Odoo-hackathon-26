import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardKPIs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalAssets,
      activeAllocations,
      underMaintenance,
      totalBookings,
    ] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'ALLOCATED' } }),
      prisma.asset.count({ where: { status: 'UNDER_MAINTENANCE' } }),
      prisma.booking.count({ where: { status: 'UPCOMING' } }),
    ]);

    // Group assets by category for visual charts
    const categoryGroup = await prisma.asset.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const categories = await prisma.assetCategory.findMany({
      select: { id: true, name: true }
    });

    const categoryDistribution = categoryGroup.map(group => {
      const cat = categories.find(c => c.id === group.categoryId);
      return {
        name: cat ? cat.name : 'Unknown',
        value: group._count.id,
      };
    });

    // Group assets by condition for condition charts
    const conditionGroup = await prisma.asset.groupBy({
      by: ['condition'],
      _count: { id: true },
    });

    const conditionDistribution = conditionGroup.map(group => ({
      name: group.condition || 'Not Specified',
      value: group._count.id,
    }));

    // Find any overdue assets (expected return date before today)
    const now = new Date();
    const overdueAssets = await prisma.asset.findMany({
      where: {
        status: 'ALLOCATED',
        expectedReturn: { lt: now },
      },
      select: {
        id: true,
        name: true,
        assetTag: true,
        expectedReturn: true,
        location: true,
      },
    });

    // Get recent transactions (e.g., recent allocations or bookings)
    const recentAssets = await prisma.asset.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        assetTag: true,
        status: true,
        updatedAt: true,
        location: true,
      }
    });

    res.json({
      totalAssets,
      activeAllocations,
      underMaintenance,
      totalBookings,
      categoryDistribution,
      conditionDistribution,
      overdueCount: overdueAssets.length,
      overdueAssets,
      recentTransactions: recentAssets,
    });
  } catch (error) {
    console.error('Dashboard KPIs Error:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics' });
  }
};
