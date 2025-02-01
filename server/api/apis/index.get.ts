import { Prisma } from '@prisma/client'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const { auth } = event.context

    // Check if user has permission to read APIs
    if (!(await auth.can('API', 'read'))) {
      throw createError({
        statusCode: 403,
        message: 'You do not have permission to view APIs'
      })
    }

    const where: Prisma.APIWhereInput = {}

    // ADMIN can see all APIs, USER can only see active APIs
    if (auth.user.role === 'USER') {
      where.isActive = {
        equals: true
      }
    }

    // Add query parameters for filtering
    const query = getQuery(event)
    if (query.search) {
      where.OR = [
        { name: { contains: query.search as string, mode: 'insensitive' } },
        { description: { contains: query.search as string, mode: 'insensitive' } }
      ]
    }

    const apis = await prisma.aPI.findMany({
      where,
      include: {
        endpoints: {
          select: {
            id: true,
            name: true,
            method: true,
            path: true,
            description: true,
            isPaid: true,
            requestLimit: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return {
      status: 'success',
      data: apis
    }

  } catch (error: any) {
    console.error('Failed to fetch APIs:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch APIs'
    })
  }
})
