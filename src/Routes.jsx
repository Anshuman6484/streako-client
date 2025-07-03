import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import LogIn from '@/pages/LogIn'
import SignUp from '@/pages/SignUp'
import Home from '@/pages/Home'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Error from '@/pages/Error'
import Signature from './pages/Signature'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '*',
        element: <Error />,
      },
      {
        path: '/login',
        element: <LogIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/upload',
        element: <Upload />,
      },
      {
        path: '/signature',
        element: <Signature />,
      },
    ],
  },
])

function Routes() {
  return <RouterProvider router={router}></RouterProvider>
}

export default Routes
