import { createBrowserRouter } from 'react-router-dom'
import HomeLayout from '../layouts/HomeLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import DashboardLayout from '../pages/DashboardLayout'
import DashboardOverview from '../pages/DashboardOverview'
import DashboardSettings from '../pages/DashboardSettings'
import ProductDetailsPage from '../pages/ProductDetailsPage'

const routes = [
  {
    path: '/',
  element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
  { path: 'product/:id', element: <ProductDetailsPage /> },
      {
        path: 'app',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: 'settings', element: <DashboardSettings /> },
        ],
      },
    ],
  },
]

export default createBrowserRouter(routes)
