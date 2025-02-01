<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="font-semibold">API Endpoints</div>
          <UButton
            color="black"
            :to="`/console/apis/${api.id}/endpoints/create`"
            icon="i-heroicons-plus"
          >
            Add Endpoint
          </UButton>
        </div>
      </template>

      <div v-if="!api.endpoints.length" class="py-12 text-center">
        <UIcon
          name="i-heroicons-squares-2x2"
          class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
        />
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
          No endpoints
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first endpoint.
        </p>
      </div>

      <div v-else class="divide-y dark:divide-gray-800">
        <div
          v-for="endpoint in api.endpoints"
          :key="endpoint.id"
          class="py-4 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 -mx-4"
        >
          <!-- Endpoint Header -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium flex items-center gap-2">
                {{ endpoint.name }}
                <UBadge v-if="endpoint.isPaid" color="yellow" class="text-xs">
                  <UIcon name="i-heroicons-lock-closed" class="w-3 h-3 mr-1" />
                  Paid
                </UBadge>
              </div>
              <div
                class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2"
              >
                <UBadge
                  :color="getMethodColor(endpoint.method)"
                  class="uppercase"
                >
                  {{ endpoint.method }}
                </UBadge>
                <code
                  class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                >
                  {{ endpoint.path }}
                </code>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton
                v-if="endpoint.isPaid"
                color="yellow"
                variant="ghost"
                icon="i-heroicons-information-circle"
                @click="endpoint.showDetails = !endpoint.showDetails"
              />
              <UButton
                color="gray"
                @click="openTester(endpoint)"
                variant="ghost"
                icon="i-heroicons-arrow-right"
              />
            </div>
          </div>

          <!-- Endpoint Description -->
          <p v-if="endpoint.description" class="text-sm text-gray-600 dark:text-gray-400">
            {{ endpoint.description }}
          </p>

          <!-- Paid Endpoint Details -->
          <div v-if="endpoint.isPaid && endpoint.showDetails" class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md space-y-2 mt-2">
            <div class="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
              <p><strong>Request Limit:</strong> {{ endpoint.requestLimit || 1000 }} requests per hour</p>
              <p><strong>Rate Limit:</strong> {{ Math.floor((endpoint.requestLimit || 1000) / 3600) }} requests per second</p>
              <p v-if="endpoint.parameters?.length"><strong>Required Parameters:</strong> {{ endpoint.parameters.filter(p => p.required).length }}</p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <ApiEndpointTester
      v-model="showTester"
      :endpoint="selectedEndpoint"
      :base-url="api.baseUrl"
      v-if="selectedEndpoint"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  description?: string;
  isPaid?: boolean;
  requestLimit?: number;
  parameters?: Parameter[];
  showDetails?: boolean;
}

interface Props {
  api: {
    id: string;
    baseUrl: string;
    endpoints: Endpoint[];
  };
}

const props = defineProps<Props>();

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "yellow",
  };
  return colors[method] || "gray";
};

const showTester = ref(false);
const selectedEndpoint = ref<Endpoint | null>(null);

const openTester = (endpoint: Endpoint) => {
  selectedEndpoint.value = endpoint;
  showTester.value = true;
};
</script>
