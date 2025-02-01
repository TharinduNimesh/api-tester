import { Prisma } from '@prisma/client'
import { createError } from 'h3'
import { createApiSchema } from '~~/shared/schemas/api'
import type { API, Endpoint } from '~~/shared/types/api'

type CreateAPIRequest = Omit<API, 'id' | 'createdAt' | 'updatedAt'> & {
  endpoints: Array<Omit<Endpoint, 'id' | 'createdAt' | 'updatedAt'>>
}

export default defineEventHandler(async (event) => {
  try {
    const { auth } = event.context

    // Check if user has permission to create APIs
    if (!(await auth.can('API', 'create'))) {
      throw createError({
        statusCode: 403,
        message: 'Only ADMIN users can create APIs'
      })
    }

    const body = await validateBody<CreateAPIRequest>(event, createApiSchema)

    const api = await prisma.aPI.create({
      data: {
        name: body.name,
        baseUrl: body.baseUrl,
        description: body.description,
        isPaid: body.isPaid,
        createdBy: auth.user.id,
        endpoints: {
          create: body.endpoints.map(endpoint => ({
            name: endpoint.name,
            method: endpoint.method,
            path: endpoint.path,
            description: endpoint.description,
            isPaid: endpoint.isPaid,
            requestLimit: endpoint.requestLimit,
            parameters: endpoint.parameters as unknown as Prisma.InputJsonValue[]
          }))
        }
      },
      include: {
        endpoints: true
      }
    })

    return {
      status: 'success',
      data: api,
      message: 'API created successfully'
    }

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        data: error.data,
        message: error.message
      })
    }

    console.error('API creation error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create API'
    })
  }
})