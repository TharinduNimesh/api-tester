<template>
  <div>
    <NuxtLayout name="console">
      <div class="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <!-- Header Section -->
        <div>
          <h1 class="text-2xl font-semibold">API Collection</h1>
          <p class="text-gray-600 dark:text-zinc-400">Manage and organize your API endpoints in one place</p>
        </div>

        <!-- Create API Button -->
        <div class="flex justify-end mb-4">
          <UButton
            v-if="user?.role == 'ADMIN'"
            color="black"
            icon="i-heroicons-plus"
            label="Create New API"
            @click="navigateTo('/console/apis/create')"
          />
        </div>

        <!-- API Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="apis.length === 0" class="col-span-full text-center py-8">
            <p class="text-gray-500 dark:text-gray-400 text-lg">No APIs found. Create your first API to get started.</p>
          </div>
          <ApiCard v-else v-for="api in apis" :key="api.id" :api="api" />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { data: apis } = await $apiFetch('/api/apis')
const { user } = useAuth()
</script>
