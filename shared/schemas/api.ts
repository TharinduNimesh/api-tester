import { z } from 'zod'

export const parameterSchema = z.object({
  name: z.string().min(1, 'Parameter name is required'),
  type: z.enum(['query', 'body', 'header', 'path']),
  required: z.boolean(),
  description: z.string().optional(),
  defaultValue: z.string().optional()
})

export const endpointSchema = z.object({
  name: z.string().min(1, 'Endpoint name is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  path: z.string().min(1, 'Path is required'),
  description: z.string().optional(),
  isPaid: z.boolean(),
  requestLimit: z.number().nullable(),
  parameters: z.array(parameterSchema)
})

export const createApiSchema = z.object({
  name: z.string().min(1, 'API name is required'),
  baseUrl: z.string().url('Invalid URL format'),
  description: z.string().optional(),
  isPaid: z.boolean(),
  endpoints: z.array(endpointSchema)
})
