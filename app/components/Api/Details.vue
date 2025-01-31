<template>
  <UCard>
    <template #header>
      <div class="font-semibold">API Details</div>
    </template>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Base URL
        </label>
        <div class="mt-1 flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <UIcon name="i-heroicons-link" class="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <code class="ml-2 font-mono text-sm flex-1">{{ api.baseUrl }}</code>
          <UButton
            size="xs"
            color="gray"
            variant="ghost"
            :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
            @click="copyToClipboard"
          />
        </div>
      </div>

      <div class="flex items-center gap-3">
        <UBadge color="primary">
          {{ api.endpoints.length }} Endpoints
        </UBadge>
        <UBadge :color="api.endpoints.length ? 'success' : 'warning'">
          {{ api.endpoints.length ? "Active" : "No Endpoints" }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

interface Props {
  api: {
    id: string;
    baseUrl: string;
    endpoints: any[];
  }
}

const props = defineProps<Props>()
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
