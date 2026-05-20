import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from 'sonner'
import '../index.css'
import '../styles/toaster.css'

const RootLayout = () => (
  <div className="app-root">
    <Toaster
      className="toaster"
      toastOptions={{
        duration: 100000,
        classNames: {
          toast: 'toast',
          title: 'title',
          description: 'description',
          actionButton: 'action-button',
          cancelButton: 'cancel-button',
          closeButton: 'close-button',
        },
      }}
    />
    <Outlet />
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
