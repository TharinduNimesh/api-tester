import { z } from 'zod';

export const parameterSchema = z.object({
  name: z.string().min(1, 'Parameter name is required'),
  type: z.enum(['query', 'body', 'header', 'path'], {
    errorMap: () => ({ message: 'Invalid parameter type' }),
  }),
  required: z.boolean(),
  description: z.string(),
  defaultValue: z.string().optional(),
});

export const endpointFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Endpoint name is required'),
  path: z.string().min(1, 'Path is required').startsWith('/', 'Path must start with /'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], {
    errorMap: () => ({ message: 'Invalid HTTP method' }),
  }),
  parameters: z.array(parameterSchema),
  description: z.string(),
  isPaid: z.boolean(),
  requestLimit: z.number().nullable(),
});