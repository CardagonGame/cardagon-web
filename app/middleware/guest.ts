export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    const returnUrl = safeReturnUrl(to.query.returnUrl as string | undefined)
    return navigateTo(returnUrl ?? '/')
  }
})
