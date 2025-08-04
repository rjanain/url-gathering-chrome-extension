import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu'
import {
  Plus,
  MoreVertical,
  Download,
  QrCode,
  Trash2,
  Edit3,
  ExternalLink,
  GripVertical,
  FolderOpen
} from 'lucide-react'
// @ts-ignore - JavaScript utility imports
import {
  getAllCollections,
  saveCollection,
  updateCollection,
  deleteCollection,
  reorderCollections,
  createCollectionFromCurrentTabs
} from '../../../utils/collectionsStorage.js'
// @ts-ignore - JavaScript utility imports
import { createTabsFromUrls } from '../../../utils/importUrls.js'
// @ts-ignore - JavaScript utility imports
import { exportCollectionAsQR } from '../../../utils/qrExport.js'

interface Collection {
  id: string
  name: string
  urls: { url: string; title: string; favIconUrl?: string }[]
  createdAt: string
  updatedAt: string
  source?: string
}

export const CollectionsPanel = () => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    setIsLoading(true)
    try {
      const savedCollections = await getAllCollections()
      setCollections(savedCollections)
    } catch (error) {
      console.error('Failed to load collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateFromCurrentTabs = async () => {
    if (!newCollectionName.trim()) return

    setIsCreating(true)
    try {
      const collection = await createCollectionFromCurrentTabs(newCollectionName.trim())
      if (collection) {
        setCollections(prev => [collection, ...prev])
        setNewCollectionName('')
      }
    } catch (error) {
      console.error('Failed to create collection:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateEmpty = async () => {
    if (!newCollectionName.trim()) return

    setIsCreating(true)
    try {
      const collection = await saveCollection({
        name: newCollectionName.trim(),
        urls: [],
        source: 'manual'
      })
      if (collection) {
        setCollections(prev => [collection, ...prev])
        setNewCollectionName('')
      }
    } catch (error) {
      console.error('Failed to create collection:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRename = async (id: string) => {
    if (!editingName.trim()) return

    try {
      await updateCollection(id, { name: editingName.trim() })
      setCollections(prev =>
        prev.map(col =>
          col.id === id ? { ...col, name: editingName.trim() } : col
        )
      )
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      console.error('Failed to rename collection:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id)
      setCollections(prev => prev.filter(col => col.id !== id))
    } catch (error) {
      console.error('Failed to delete collection:', error)
    }
  }

  const handleOpenAll = async (collection: Collection) => {
    try {
      await createTabsFromUrls(collection.urls, {
        deduplicate: true,
        openInBackground: true
      })
    } catch (error) {
      console.error('Failed to open collection:', error)
    }
  }

  const handleExportQR = async (collection: Collection) => {
    try {
      await exportCollectionAsQR(collection)
    } catch (error) {
      console.error('Failed to export QR:', error)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newCollections = [...collections]
    const draggedItem = newCollections[draggedIndex]

    // Remove from old position
    newCollections.splice(draggedIndex, 1)

    // Insert at new position
    newCollections.splice(dropIndex, 0, draggedItem)

    setCollections(newCollections)
    setDraggedIndex(null)

    // Save new order
    try {
      await reorderCollections(newCollections)
    } catch (error) {
      console.error('Failed to save collection order:', error)
      // Revert on error
      loadCollections()
    }
  }

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id)
    setEditingName(collection.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Collections</h2>

        {/* Create New Collection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Create New Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCollectionName.trim()) {
                  handleCreateFromCurrentTabs()
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateFromCurrentTabs}
                disabled={!newCollectionName.trim() || isCreating}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                From Current Tabs
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateEmpty}
                disabled={!newCollectionName.trim() || isCreating}
              >
                Empty
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Collections List */}
        <div className="space-y-3">
          {collections.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-muted-foreground">
                <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No collections yet</p>
                <p className="text-xs">Create your first collection above</p>
              </CardContent>
            </Card>
          ) : (
            collections.map((collection, index) => (
              <Card
                key={collection.id}
                className="cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {editingId === collection.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(collection.id)
                            if (e.key === 'Escape') cancelEditing()
                          }}
                          onBlur={() => handleRename(collection.id)}
                          className="h-6 text-sm"
                          autoFocus
                        />
                      ) : (
                        <h3 className="font-medium text-sm truncate">{collection.name}</h3>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditing(collection)}>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenAll(collection)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open All
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportQR(collection)}>
                          <QrCode className="h-4 w-4 mr-2" />
                          Export QR
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(collection.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{collection.urls.length} URLs</span>
                    <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                  </div>

                  {collection.urls.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {collection.urls.slice(0, 3).map((url, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground truncate">
                          {url.title || url.url}
                        </div>
                      ))}
                      {collection.urls.length > 3 && (
                        <div className="text-xs text-muted-foreground italic">
                          ... and {collection.urls.length - 3} more
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAll(collection)}
                      className="h-6 text-xs flex-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExportQR(collection)}
                      className="h-6 text-xs"
                    >
                      <QrCode className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
