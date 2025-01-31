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
const apiStore = useApiStore()

const pending = ref(true)
const showDeleteModal = ref(false)

onBeforeMount(async () => {
  pending.value = true
  await nextTick()
  const apiExists = apiStore.getApiById(route.params.id as string)
  if (!apiExists) {
    toast.add({
      title: 'API Not Found',
      description: 'The requested API could not be found.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
  pending.value = false
})

const api = computed(() => apiStore.getApiById(route.params.id as string))

const confirmDelete = () => {
  showDeleteModal.value = true
}

const handleDelete = () => {
  if (!api.value?.id) return
  apiStore.deleteApi(api.value.id)
  showDeleteModal.value = false
  router.push('/console/apis')
  toast.add({
    title: 'API Deleted',
    description: 'The API has been successfully deleted',
    icon: 'i-heroicons-check-circle',
    color: 'red'
  })
}
</script>
