import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import { Toaster } from 'sonner'
import Navbar from './Navbar'

function AppLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ScrollToTop />
        <Toaster />
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
