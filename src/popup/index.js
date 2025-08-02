import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Import main stylesheet
import '../assets/css/main.scss'

const rootElement = document.getElementById("react-target")
const root = createRoot(rootElement)

function Popup() {
  return (
    <div className="extension-popup">
        <App/>
    </div>
  )
}

root.render(<Popup />)

