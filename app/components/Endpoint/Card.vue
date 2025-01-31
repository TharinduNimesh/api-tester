<!-- EndpointCard.vue -->
<template>
  <div class="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900">
    <!-- Endpoint Header -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="font-medium text-lg truncate">
          {{ endpoint.name || "Unnamed Endpoint" }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ endpoint.description || "No description" }}
        </p>
      </div>
      <div class="flex space-x-2 ml-4">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil"
          size="xs"
          @click="$emit('edit')"
          class="hover:bg-gray-100 dark:hover:bg-gray-800"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="xs"
          @click="$emit('delete')"
          class="hover:bg-red-50 dark:hover:bg-red-900/20"
        />
      </div>
    </div>

    <!-- Endpoint Details -->
    <div class="space-y-3">
      <div class="flex items-center space-x-2">
        <UBadge :color="getMethodColor(endpoint.method)" class="font-mono">
          {{ endpoint.method }}
        </UBadge>
        <span class="text-sm font-mono truncate flex-1">{{ endpoint.path }}</span>
      </div>

      <!-- Parameters Summary -->
      <div v-if="endpoint.parameters.length > 0">
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
          Parameters ({{ endpoint.parameters.length }}):
        </p>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="param in endpoint.parameters"
            :key="param.name"
            color="gray"
            variant="soft"
            class="text-xs"
          >
            {{ param.name }}
            <span class="text-gray-500">({{ param.type }})</span>
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Endpoint } from '~/types';

defineProps<{
  endpoint: Endpoint;
}>();

defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

function getMethodColor(method: string): string {
  const colors = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "purple",
  };
  return colors[method as keyof typeof colors] || "gray";
}
</script>
