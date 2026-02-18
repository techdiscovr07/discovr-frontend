import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has a <div id="root"></div> element.')
}

try {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; color: #fff; background: #0a0a0a; min-height: 100vh;">
      <h1 style="color: #ff4444;">Application Error</h1>
      <p>Failed to initialize the application. Please check the browser console for details.</p>
      <pre style="background: #1a1a1a; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 20px;">
${error instanceof Error ? error.stack : String(error)}
      </pre>
    </div>
  `
}
