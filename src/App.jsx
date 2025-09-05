import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'

function App() {
  const [count, setCount] = useState(0)
  const { user, login, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="p-8">
      <div className="flex gap-4 items-center mb-6">
        <img src={viteLogo} className="h-16" alt="Vite logo" />
        <img src={reactLogo} className="h-16" alt="React logo" />
        <h1 className="text-3xl font-bold">Vite + React + Tailwind + DaisyUI</h1>
      </div>

      <div className="card bg-base-200 p-6 rounded-lg">
        <div className="mb-4">
          <button className="btn" onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </button>
        </div>

        <div className="mb-4">
          {user ? (
            <div className="flex gap-2 items-center">
              <span>Signed in as <strong>{user.name}</strong></span>
              <button className="btn btn-ghost" onClick={logout}>Sign out</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => login({ name: 'Demo' })}>
              Sign in
            </button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <label className="mr-2">Theme:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="select select-bordered w-auto">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default App
