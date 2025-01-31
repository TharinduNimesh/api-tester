<template>
  <div class="flex items-center gap-4">
    <UButton
      icon="i-heroicons-arrow-left"
      variant="ghost"
      color="gray"
      to="/console/apis"
    />
    <div class="flex-1">
      <h1 class="text-2xl font-semibold">{{ api.name }}</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {{ api.description }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <UButton
        icon="i-heroicons-pencil-square"
        color="gray"
        :to="`/console/apis/${api.id}/edit`"
      >
        Edit
      </UButton>
      <UButton
        icon="i-heroicons-trash"
        color="red"
        @click="emit('delete')"
      >
        Delete
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  api: {
    id: string;
    name: string;
    description: string;
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  delete: []
}>()
</script>
