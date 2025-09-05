import { Outlet, Link } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">App Dashboard</h2>
      <nav className="my-4 flex gap-2">
        <Link to="." className="btn btn-sm">Overview</Link>
        <Link to="settings" className="btn btn-sm">Settings</Link>
      </nav>
      <div className="p-4 bg-base-200 rounded">
        <Outlet />
      </div>
    </div>
  )
}
