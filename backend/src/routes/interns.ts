import { Router } from 'express';
import { prisma } from '../config/database';
import { authenticate, authorize, authorizeMentorAccess } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateInternSchema, ApiError } from '../types';
import { logger } from '../config/logger';
import { z } from 'zod';

const router = Router();

// Query schema for filtering interns
const GetInternsQuerySchema = z.object({
  department: z.string().optional(),
  status: z.string().optional(),
  mentorId: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

/**
 * POST /api/interns
 * Create a new intern record
 */
router.post('/',
  authenticate,
  authorize('ADMIN', 'EMPLOYEE'),
  validateBody(CreateInternSchema),
  asyncHandler(async (req, res) => {
    const internData = req.body;

    // Generate unique intern ID
    const internId = `IOCL-${Date.now().toString().slice(-6)}`;

    // Create intern record
    const intern = await prisma.intern.create({
      data: {
        ...internData,
        internId,
        documents: internData.documents || {},
      },
    });

    // Create initial application record
    await prisma.application.create({
      data: {
        internId: intern.id,
        status: 'SUBMITTED',
      },
    });

    logger.info(`New intern created: ${intern.name} (${intern.internId})`);

    res.status(201).json({
      success: true,
      data: intern,
      message: 'Intern created successfully',
    });
  })
);

/**
 * GET /api/interns
 * Get list of interns with filtering and pagination
 */
router.get('/',
  authenticate,
  validateQuery(GetInternsQuerySchema),
  asyncHandler(async (req, res) => {
    const { department, status, mentorId, page, limit } = req.query as any;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (department) {
      where.department = department;
    }
    
    if (status) {
      where.status = status;
    }

    // For mentors, only show their assigned interns
    if (req.user?.role === 'MENTOR') {
      const mentor = await prisma.mentor.findUnique({
        where: { empId: req.user.empId },
      });

      if (mentor) {
        const assignments = await prisma.assignment.findMany({
          where: { mentorId: mentor.id, isActive: true },
          select: { internId: true },
        });

        where.id = {
          in: assignments.map(a => a.internId),
        };
      }
    }

    if (mentorId && req.user?.role === 'ADMIN') {
      const assignments = await prisma.assignment.findMany({
        where: { mentorId, isActive: true },
        select: { internId: true },
      });

      where.id = {
        in: assignments.map(a => a.internId),
      };
    }

    // Get interns with pagination
    const [interns, total] = await Promise.all([
      prisma.intern.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignments: {
            where: { isActive: true },
            include: {
              mentor: {
                select: {
                  name: true,
                  empId: true,
                  department: true,
                },
              },
            },
          },
          applications: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.intern.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        interns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  })
);

/**
 * GET /api/interns/:id
 * Get intern by ID
 */
router.get('/:id',
  authenticate,
  authorizeMentorAccess,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            mentor: {
              select: {
                name: true,
                empId: true,
                department: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        applications: {
          orderBy: { createdAt: 'desc' },
        },
        feedback: {
          include: {
            mentor: {
              select: {
                name: true,
                empId: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          include: {
            mentor: {
              select: {
                name: true,
                empId: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        projects: {
          include: {
            mentor: {
              select: {
                name: true,
                empId: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
        meetings: {
          include: {
            mentor: {
              select: {
                name: true,
                empId: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    res.json({
      success: true,
      data: intern,
    });
  })
);

/**
 * PUT /api/interns/:id
 * Update intern information
 */
router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.internId;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const intern = await prisma.intern.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Intern updated: ${intern.name} (${intern.internId})`);

    res.json({
      success: true,
      data: intern,
      message: 'Intern updated successfully',
    });
  })
);

/**
 * DELETE /api/interns/:id
 * Delete intern (soft delete by updating status)
 */
router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Soft delete by updating status
    const intern = await prisma.intern.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    logger.info(`Intern deleted: ${intern.name} (${intern.internId})`);

    res.json({
      success: true,
      message: 'Intern deleted successfully',
    });
  })
);

/**
 * GET /api/interns/:id/documents
 * Get intern documents
 */
router.get('/:id/documents',
  authenticate,
  authorizeMentorAccess,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const intern = await prisma.intern.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        internId: true,
        documents: true,
      },
    });

    if (!intern) {
      throw new ApiError('Intern not found', 404);
    }

    res.json({
      success: true,
      data: {
        internId: intern.internId,
        name: intern.name,
        documents: intern.documents,
      },
    });
  })
);

export default router;