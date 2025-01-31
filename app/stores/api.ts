import { defineStore } from 'pinia';

interface Parameter {
  name: string;
  type: "query" | "body" | "header" | "path";
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  parameters: Parameter[];
  description: string;
}

interface API {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: Endpoint[];
}

const sampleApis: API[] = [
  {
    id: "1",
    name: "Weather API",
    baseUrl: "https://api.weatherservice.com/v1",
    description: "Real-time weather data and forecasts",
    endpoints: [
      {
        id: "w1",
        name: "Get Current Weather",
        path: "/current",
        method: "GET",
        description: "Get current weather for a specific location",
        parameters: [
          {
            name: "city",
            type: "query",
            required: true,
            description: "City name",
            defaultValue: "London",
          },
          {
            name: "units",
            type: "query",
            required: false,
            description: "Temperature units (celsius/fahrenheit)",
            defaultValue: "celsius",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "E-commerce API",
    baseUrl: "https://api.shop.com/v2",
    description: "E-commerce platform API for managing products and orders",
    endpoints: [
      {
        id: "e1",
        name: "Create Product",
        path: "/products",
        method: "POST",
        description: "Create a new product",
        parameters: [
          {
            name: "product",
            type: "body",
            required: true,
            description: "Product details",
            defaultValue: JSON.stringify({
              name: "Sample Product",
              price: 99.99,
              description: "Product description",
            }),
          },
          {
            name: "Authorization",
            type: "header",
            required: true,
            description: "Bearer token",
            defaultValue: "Bearer {token}",
          },
        ],
      },
      {
        id: "e2",
        name: "Get Product",
        path: "/products/:id",
        method: "GET",
        description: "Get product details by ID",
        parameters: [
          {
            name: "id",
            type: "path",
            required: true,
            description: "Product ID",
            defaultValue: "123",
          },
        ],
      },
    ],
  },
];

export const useApiStore = defineStore('api', {
  state: () => ({
    apis: [...sampleApis] as API[],
  }),

  actions: {
    addApi(api: Omit<API, 'id'>) {
      const newApi: API = {
        ...api,
        id: crypto.randomUUID(),
      };
      this.apis.push(newApi);
      return newApi;
    },

    deleteApi(id: string) {
      const index = this.apis.findIndex(api => api.id === id);
      if (index !== -1) {
        this.apis.splice(index, 1);
      }
    },

    updateApi(api: API) {
      const index = this.apis.findIndex(a => a.id === api.id);
      if (index !== -1) {
        this.apis[index] = api;
      }
    },

    getApiById(id: string) {
      return this.apis.find(api => api.id === id);
    },
  },
});
