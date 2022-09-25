import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootElement = document.getElementById("react-target")
const root = createRoot(rootElement)




function Popup() {


  return (
    <> 
        <App/>
    </>
  )
}


root.render(<Popup />)

