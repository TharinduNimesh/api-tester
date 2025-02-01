export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (user.value?.role !== 'ADMIN') {
    return navigateTo(from.path || '/console')
  }
})
