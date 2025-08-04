import React from 'react'
import { TooltipProvider } from '../components/ui/tooltip'
import { CollectionsPanel } from '../shared/components/collections/CollectionsPanel'

function SidePanelApp() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <CollectionsPanel />
      </div>
    </TooltipProvider>
  )
}

export default SidePanelApp
