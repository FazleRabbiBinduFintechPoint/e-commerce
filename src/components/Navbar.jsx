import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useEffect, useState } from 'react'
import CartSidebar from './CartSidebar'
import { useRef } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [cartCount, setCartCount] = useState(0)
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      const items = raw ? JSON.parse(raw) : []
      setCartCount(items.length)
    } catch (e) {
      setCartCount(0)
    }
    try {
      const u = localStorage.getItem('user')
      setUserData(u ? JSON.parse(u) : null)
    } catch (err) {
      setUserData(null)
    }
  }, [])

  // close account dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <>
    <div className="navbar bg-base-200 px-4">
      <div className="flex-none lg:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Project Blanco</Link>

        <div className="hidden md:flex items-center gap-2">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-sm">Categories</label>
            <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>All</a></li>
              <li><a>New</a></li>
              <li><a>Popular</a></li>
            </ul>
          </div>

          <div className="form-control">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products" className="input input-sm input-bordered w-64" />
          </div>
        </div>
      </div>

      <div className="flex-none hidden lg:flex items-center gap-3">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/about">About</Link></li>
        </ul>

        <div className="ml-4 flex items-center gap-2">
          <button aria-label="Toggle theme" className="btn btn-ghost btn-circle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-12.34l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m15.66 4.66l-.7-.7M6.34 6.34l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.64 13a9 9 0 11-9.6-9.6 7 7 0 009.6 9.6z" />
              </svg>
            )}
          </button>

          <button className="btn btn-ghost btn-circle indicator" onClick={() => setCartOpen(true)} aria-label="Open cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14" />
            </svg>
            {cartCount > 0 && <span className="badge badge-sm indicator-item">{cartCount}</span>}
          </button>

          <div className="relative" ref={accountRef}>
            <button className="btn btn-ghost btn-circle" onClick={() => setAccountOpen((v) => !v)} aria-expanded={accountOpen} aria-haspopup>
              <div className="avatar">
                <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center overflow-hidden">
                  {userData && userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name || 'Account'} />
                  ) : (
                    <span className="text-sm font-medium text-base-content/80">{(userData && userData.name) ? userData.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : 'A'}</span>
                  )}
                </div>
              </div>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-base-100 shadow-md rounded-md p-2">
                {userData ? (
                  <ul className="menu p-0">
                    <li><Link to="/account/profile" onClick={() => setAccountOpen(false)}>Profile</Link></li>
                    <li><a onClick={() => { setCartOpen(true); setAccountOpen(false) }}>Cart</a></li>
                    <li><Link to="/orders" onClick={() => setAccountOpen(false)}>Orders</Link></li>
                    <li><a onClick={() => { localStorage.removeItem('user'); setUserData(null); setAccountOpen(false) }}>Logout</a></li>
                  </ul>
                ) : (
                  <ul className="menu p-0">
                    <li><Link to="/login" onClick={() => setAccountOpen(false)}>Login</Link></li>
                    <li><Link to="/signup" onClick={() => setAccountOpen(false)}>Sign up</Link></li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <CartSidebar show={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
