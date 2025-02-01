export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const
export const PARAMETER_TYPES = ['query', 'body', 'header', 'path'] as const

export type HttpMethod = typeof HTTP_METHODS[number]
export type ParameterType = typeof PARAMETER_TYPES[number]

export interface Parameter {
  name: string
  type: ParameterType
  required: boolean
  description: string
  defaultValue: string
}

export interface Endpoint {
  id: string
  name: string
  method: HttpMethod
  path: string
  description: string
  parameters: Parameter[]
  isPaid: boolean
  requestLimit: number
}

export type EndpointFormData = Omit<Endpoint, 'id'> & { id?: string }
