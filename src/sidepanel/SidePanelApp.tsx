import React from 'react'
import { TooltipProvider } from '../components/ui/tooltip'
import { CollectionsPanel } from '../shared/components/collections/CollectionsPanel'

function SidePanelApp() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <CollectionsPanel />
        </div>
      </div>
    </TooltipProvider>
  )
}

export default SidePanelApp
