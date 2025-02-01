import { defineEventHandler } from 'h3'
import { PrismaClient } from '@prisma/client'
import { createError } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { auth } = event.context
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'API ID is required'
      })
    }

    // Check if user has permission to view APIs
    if (!(await auth.can('API', 'read'))) {
      throw createError({
        statusCode: 403,
        message: 'You do not have permission to view this API'
      })
    }

    const api = await prisma.aPI.findUnique({
      where: { id },
      include: {
        endpoints: true
      }
    })

    if (!api) {
      throw createError({
        statusCode: 404,
        message: 'API not found'
      })
    }

    return {
      status: 'success',
      data: api,
      message: 'API retrieved successfully'
    }

  } catch (error: any) {
    console.error('API retrieval error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to retrieve API'
    })
  }
})
