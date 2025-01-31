<template>
  <footer class="mt-auto bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
    <div class="h-16 px-6 flex items-center justify-between">
      <!-- Copyright -->
      <div class="text-sm text-slate-500 dark:text-zinc-400">
        © {{ new Date().getFullYear() }} Nuxt Kit. All rights reserved.
      </div>
      
      <!-- Links -->
      <div class="flex items-center space-x-4">
        <NuxtLink 
          v-for="link in links" 
          :key="link.text"
          :to="link.to"
          class="text-sm text-slate-500 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {{ link.text }}
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
const links = [
  { text: 'Privacy Policy', to: '/privacy' },
  { text: 'Terms of Service', to: '/terms' },
  { text: 'Contact', to: '/contact' }
];
</script>
