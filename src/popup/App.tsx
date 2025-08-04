import React, { useState } from 'react'
import { TooltipProvider } from '../components/ui/tooltip'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { HomeCard } from '../shared/components/home/HomeCard'
import { OptionCard } from '../shared/components/options/OptionCard'
import { ImportCard } from '../shared/components/import/ImportCard'
import { CollectionsViewCard } from '../shared/components/collections/CollectionsViewCard'

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'import' | 'collections' | 'option'>('home')

  return (
    <TooltipProvider>
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="space-y-4">
          {/* Tab Header */}
          <div className="flex space-x-1 border-b">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActiveTab('home')}
            >
              Copy
            </Button>
            <Button
              variant={activeTab === 'import' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActiveTab('import')}
            >
              Import
            </Button>
            <Button
              variant={activeTab === 'collections' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActiveTab('collections')}
            >
              Collections
            </Button>
            <Button
              variant={activeTab === 'option' ? 'default' : 'ghost'}
              className="flex-1 rounded-none text-xs"
              onClick={() => setActiveTab('option')}
            >
              Settings
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'home' && (
            <Card className="w-full">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">LinkPilot</h3>
              </CardHeader>
              <CardContent>
                <HomeCard />
              </CardContent>
            </Card>
          )}

          {activeTab === 'import' && (
            <Card className="w-full">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">Import URLs</h3>
                <p className="text-sm text-muted-foreground">
                  Paste URLs to open as tabs
                </p>
              </CardHeader>
              <CardContent>
                <ImportCard />
              </CardContent>
            </Card>
          )}

          {activeTab === 'collections' && (
            <Card className="w-full">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">My Collections</h3>
                <p className="text-sm text-muted-foreground">
                  Saved URL collections
                </p>
              </CardHeader>
              <CardContent>
                <CollectionsViewCard />
              </CardContent>
            </Card>
          )}

          {activeTab === 'option' && (
            <Card className="w-full">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">Settings</h3>
              </CardHeader>
              <CardContent>
                <OptionCard />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default App
