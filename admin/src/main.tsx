import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import SetupError from './components/SetupError.tsx'
import { missingConfig } from './lib/firebase'

const root = createRoot(document.getElementById('root')!)

// A build without its Firebase/website settings can't start auth at all — explain what's
// missing instead of crashing into a blank page.
if (missingConfig.length > 0) {
  root.render(<SetupError missing={missingConfig} />)
} else {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#141c2e', color: '#F8FAFC', border: '1px solid rgba(99,130,255,0.15)' },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}
