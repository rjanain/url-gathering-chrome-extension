import React from 'react'
import { TooltipProvider } from '../components/ui/tooltip'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { CollectionsPanel } from '../shared/components/collections/CollectionsPanel'

function SidePanelApp() {
  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="space-y-4">
          {/* Main Collections Card */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Collections Manager</h3>
              <p className="text-sm text-muted-foreground">
                Organize and manage your saved URL collections
              </p>
            </CardHeader>
            <CardContent>
              <CollectionsPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default SidePanelApp
