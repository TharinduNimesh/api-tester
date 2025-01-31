<!-- EndpointList.vue -->
<template>
  <div>
    <div
      v-if="endpoints.length === 0"
      class="text-center py-12 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
    >
      <div class="flex flex-col items-center">
        <UIcon
          name="i-heroicons-square-3-stack-3d"
          class="w-12 h-12 text-gray-400 mb-4"
        />
        <p class="text-gray-500 mb-2">No endpoints added yet</p>
        <UButton color="black" icon="i-heroicons-plus-circle" @click="$emit('add')">
          Add Your First Endpoint
        </UButton>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <EndpointCard
        v-for="(endpoint, index) in endpoints"
        :key="endpoint.id"
        :endpoint="endpoint"
        @edit="$emit('edit', index)"
        @delete="$emit('delete', index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Endpoint } from '~/types';

defineProps<{
  endpoints: Endpoint[];
}>();

defineEmits<{
  (e: 'add'): void;
  (e: 'edit', index: number): void;
  (e: 'delete', index: number): void;
}>();
</script>
