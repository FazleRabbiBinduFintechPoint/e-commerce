import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
