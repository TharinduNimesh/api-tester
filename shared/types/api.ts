
export interface Parameter {
  name: string
  type: 'query' | 'body' | 'header' | 'path'
  required: boolean
  description?: string
  defaultValue?: string
}

export interface Endpoint {
  id?: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description?: string
  isPaid: boolean
  requestLimit: number | null
  parameters: Parameter[]
}

export interface API {
  id?: string
  name: string
  baseUrl: string
  description?: string
  isPaid: boolean
  endpoints: Endpoint[]
  createdAt?: Date
  updatedAt?: Date
}