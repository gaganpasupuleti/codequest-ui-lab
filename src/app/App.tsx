import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './routes'
import { NavMenuProvider } from '@/lib/navMenu'

export default function App() {
  return (
    <NavMenuProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </NavMenuProvider>
  )
}
