<template>
  <UCard class="flex flex-col h-full">
    <div class="flex-1">
      <!-- Header -->
      <div>
        <h2 class="text-xl font-semibold">
          {{ api.name }}
        </h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
          {{ api.description }}
        </p>
      </div>

      <!-- Base URL -->
      <div class="mt-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Base URL
        </label>
        <div
          class="mt-1 flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <UIcon
            name="i-heroicons-link"
            class="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400"
          />
          <div class="ml-2 font-mono text-sm truncate">
            {{ api.baseUrl }}
          </div>
          <UButton
            size="xs"
            color="gray"
            variant="ghost"
            :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
            class="ml-auto"
            @click="copyToClipboard"
          />
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-4">
        <UBadge
          :color="api.endpoints.length > 0 ? 'primary' : 'gray'"
          variant="soft"
          size="sm"
        >
          <template #leading>
            <UIcon name="i-heroicons-squares-2x2" />
          </template>
          {{ api.endpoints.length }} Endpoints
        </UBadge>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="mt-4">
      <UDivider class="mb-4" />
      <UButton :to="`/console/apis/${api.id}`" color="gray" block>
        View Details
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right" />
        </template>
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

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

const props = defineProps<{
  api: API;
}>();

const { copy } = useClipboard()
const toast = useToast()
const copied = ref(false)

const copyToClipboard = async () => {
  await copy(props.api.baseUrl)
  copied.value = true
  toast.add({
    title: 'Copied to clipboard',
    description: 'Base URL has been copied to your clipboard',
    icon: 'i-heroicons-check-circle',
    timeout: 2000
  })
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
