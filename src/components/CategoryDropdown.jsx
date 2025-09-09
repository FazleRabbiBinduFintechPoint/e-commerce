import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

// JS-driven recursive multi-level category dropdown
export default function CategoryDropdown({ categories = [] }) {
  const [openPath, setOpenPath] = useState([]) // e.g. ['men','formal','shirt']
  const rootRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpenPath([])
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleMouseLeave() {
    // small delay could be added if desired
    setOpenPath([])
  }

  return (
    <nav ref={rootRef} className="relative" onMouseLeave={handleMouseLeave}>
      <ul className="menu p-2 shadow bg-base-100 rounded-box w-64">
        {categories.map((c) => (
          <CategoryItem
            key={c.id}
            item={c}
            path={[c.id]}
            openPath={openPath}
            setOpenPath={setOpenPath}
          />
        ))}
      </ul>
    </nav>
  )
}

function CategoryItem({ item, path = [], openPath, setOpenPath }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0

  const pathKey = path.join('/')
  const openKey = openPath.join('/')

  const isOpen = openKey === pathKey || openKey.startsWith(pathKey + '/')
  const directOpen = openKey === pathKey

  // show submenu when this path is an ancestor of the open path
  function openThis() {
    setOpenPath(path)
  }

  function toggleThis(e) {
    e.stopPropagation()
    if (openKey === pathKey) setOpenPath(path.slice(0, -1))
    else setOpenPath(path)
  }

  return (
    <li className="relative" onMouseEnter={openThis}>
      <div className="flex items-center justify-between gap-2 whitespace-nowrap px-2 py-1">
        {hasChildren ? (
          <button type="button" onClick={toggleThis} className="flex-1 text-left" aria-expanded={isOpen}>
            {item.label}
          </button>
        ) : item.to ? (
          <Link to={item.to} className="flex-1">{item.label}</Link>
        ) : (
          <span className="flex-1">{item.label}</span>
        )}

        {hasChildren && <span className="opacity-70">›</span>}
      </div>

      {hasChildren && isOpen && (
        <div className="absolute top-0 left-full ml-0 z-50" style={{ minWidth: 220 }}>
          <div className="shadow-lg bg-base-100 rounded-md p-2">
            <ul className="menu p-0">
              {item.children.map((c) => (
                <CategoryItem
                  key={c.id}
                  item={c}
                  path={[...path, c.id]}
                  openPath={openPath}
                  setOpenPath={setOpenPath}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}
