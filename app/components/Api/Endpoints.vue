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
          class="py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 -mx-4"
        >
          <div>
            <div class="font-medium">{{ endpoint.name }}</div>
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
            <UButton
            color="gray"
            @click="openTester(endpoint)"
            variant="ghost"
            icon="i-heroicons-arrow-right"
          />
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
interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: string;
}

interface Props {
  api: {
    id: string;
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
const selectedEndpoint = ref<Props["api"]["endpoints"][0] | null>(null);

const openTester = (endpoint: Props["api"]["endpoints"][0]) => {
  selectedEndpoint.value = endpoint;
  showTester.value = true;
};
</script>
