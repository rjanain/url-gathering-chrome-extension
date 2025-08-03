import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '../styles/globals.css'

const rootElement = document.getElementById("react-target")
if (!rootElement) {
  throw new Error('React target element not found')
}
const root = createRoot(rootElement)

function Popup() {
  return (
    <App />
  )
}

root.render(<Popup />)
