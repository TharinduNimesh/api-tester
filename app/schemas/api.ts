import { z } from 'zod';

// Parameter schema
export const parameterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['query', 'body', 'header', 'path'], {
    errorMap: () => ({ message: 'Invalid parameter type' }),
  }),
  required: z.boolean(),
  description: z.string(),
  defaultValue: z.string().optional(),
});

// Endpoint schema
export const endpointSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  path: z.string().min(1, 'Path is required'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], {
    errorMap: () => ({ message: 'Invalid HTTP method' }),
  }),
  parameters: z.array(parameterSchema),
  description: z.string(),
  isPaid: z.boolean(),
  requestLimit: z.number().nullable(),
});

// API schema
export const apiSchema = z.object({
  name: z.string().min(1, 'API name is required'),
  baseUrl: z.string().url('Must be a valid URL'),
  description: z.string(),
  isPaid: z.boolean(),
  endpoints: z.array(endpointSchema),
});