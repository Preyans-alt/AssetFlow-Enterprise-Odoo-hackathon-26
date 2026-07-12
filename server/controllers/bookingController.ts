import { Response } from 'express';
import { prisma } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assetId, startTime, endTime } = req.body;
    const userId = req.user?.id;

    if (!assetId || !startTime || !endTime || !userId) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      res.status(400).json({ error: 'End time must be after start time' });
      return;
    }

    // Check if asset is bookable and exists
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) {
      res.status(404).json({ error: 'Asset not found' });
      return;
    }

    if (!asset.isBookable) {
      res.status(400).json({ error: 'This asset is not marked as shared/bookable' });
      return;
    }

    // OVERLAP VALIDATION: Check if any other upcoming/ongoing booking overlaps
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        assetId,
        status: { in: ['UPCOMING', 'ONGOING'] },
        OR: [
          {
            startTime: { lt: end },
            endTime: { gt: start },
          },
        ],
      },
    });

    if (overlappingBooking) {
      res.status(400).json({
        error: 'Time slot overlaps with an existing booking',
        details: overlappingBooking,
      });
      return;
    }

    const booking = await prisma.booking.create({
      data: {
        assetId,
        userId,
        startTime: start,
        endTime: end,
        status: 'UPCOMING',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
