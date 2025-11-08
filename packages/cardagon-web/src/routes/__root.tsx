import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import '../index.css'

const RootLayout = () => (
  <div className="app-root">
    <Toaster />
    <Outlet />
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
