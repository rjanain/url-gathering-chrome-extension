import React from 'react'
import { TooltipProvider } from '../components/ui/tooltip'
import { Header, HomeTab, OptionTab } from '../shared/components/Home'

function App() {
  return (
    <TooltipProvider>
      <div className="w-full max-w-sm mx-auto p-4 bg-background text-foreground">
        <div className="space-y-4">
          <Header />
          <HomeTab />
          <OptionTab />
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App
