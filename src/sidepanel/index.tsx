import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../popup/App'
import '../styles/globals.css'

const container = document.getElementById('sidepanel-root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}
