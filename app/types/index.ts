export interface Parameter {
  name: string;
  type: "query" | "body" | "header" | "path";
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  parameters: Parameter[];
  description: string;
}

export interface API {
  id?: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: Endpoint[];
}
