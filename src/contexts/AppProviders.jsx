import { AuthProvider } from './AuthContext'
import { ThemeProvider } from './ThemeContext'

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  )
}
