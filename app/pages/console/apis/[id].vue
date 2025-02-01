<template>
  <div>
    <NuxtLayout name="console">
      <div class="p-6 bg-white dark:bg-zinc-900 min-h-screen space-y-6 border border-gray-200 dark:border-gray-800 rounded-lg">
        <!-- Loading State -->
        <template v-if="pending">
          <USkeleton class="h-8 w-1/3 mb-2" />
          <USkeleton class="h-4 w-1/2 mb-6" />
          <USkeleton class="h-[200px] mb-4" />
          <USkeleton class="h-[300px]" />
        </template>

        <!-- Error State -->
        <template v-else-if="!api">
          <UAlert
            title="API Not Found"
            description="The requested API could not be found. It may have been deleted or you may have insufficient permissions."
            color="red"
            class="mb-4"
          >
            <template #icon>
              <UIcon name="i-heroicons-exclamation-triangle" />
            </template>
            <template #actions>
              <UButton color="white" variant="solid" to="/console/apis" size="sm">
                Return to APIs
              </UButton>
            </template>
          </UAlert>
        </template>

        <template v-else>
          <ApiHeader :api="api" @delete="confirmDelete" />
          <ApiDetails :api="api" />
          
          <!-- Paid API Notes -->
          <div v-if="api.isPaid" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 class="font-semibold text-yellow-600 dark:text-yellow-400">Paid API Information</h3>
            </div>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">
              This is a paid API. Usage is subject to the following limits:
            </p>
            <ul class="text-sm text-yellow-600 dark:text-yellow-400 list-disc list-inside">
              <li>Max requests per hour: 1000</li>
              <li>Rate limit: 10 requests per second</li>
              <li>Additional charges may apply for high usage</li>
            </ul>
          </div>

          <ApiEndpoints :api="api" />
        </template>
      </div>
    </NuxtLayout>

    <!-- Delete Modal -->
    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          <div class="font-semibold">Delete API</div>
        </template>
        <p class="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this API? This action cannot be undone.
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" @click="showDeleteModal = false">Cancel</UButton>
            <UButton color="red" @click="handleDelete">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()

const pending = ref(true)
const api = ref(null)
const showDeleteModal = ref(false)

const fetchApi = async () => {
  try {
    const response = await $apiFetch(`/api/apis/${route.params.id}`)
    api.value = response.data
  } catch (error: any) {
    toast.add({
      title: 'Error Loading API',
      description: error.data?.message || 'Failed to load API details',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
    api.value = null
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchApi()
})

const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!api.value?.id) return
  try {
    await $fetch(`/api/apis/${api.value.id}`, {
      method: 'DELETE'
    })
    showDeleteModal.value = false
    router.push('/console/apis')
    toast.add({
      title: 'API Deleted',
      description: 'The API has been successfully deleted',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error Deleting API',
      description: error.data?.message || 'Failed to delete API',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
}
</script>
