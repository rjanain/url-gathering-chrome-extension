import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import {
    Settings,
    ExternalLink,
    QrCode,
    Download,
    Plus,
    FolderOpen
} from 'lucide-react'
// @ts-ignore - JavaScript utility imports
import { getAllCollections } from '../../../utils/collectionsStorage.js'
// @ts-ignore - JavaScript utility imports
import { createTabsFromUrls } from '../../../utils/importUrls.js'
// @ts-ignore - JavaScript utility imports
import { exportCollectionAsQR } from '../../../utils/qrExport.js'
// @ts-ignore - JavaScript utility imports
import { Browser } from '../../../utils/browser.js'

interface Collection {
    id: string
    name: string
    urls: { url: string; title: string; favIconUrl?: string }[]
    createdAt: string
    updatedAt: string
}

export const CollectionsViewCard = () => {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [actionStates, setActionStates] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        loadCollections()
    }, [])

    const loadCollections = async () => {
        try {
            const savedCollections = await getAllCollections()
            setCollections(savedCollections)
        } catch (error) {
            console.error('Failed to load collections:', error)
        } finally {
            setLoading(false)
        }
    }

    const openSidePanel = async () => {
        try {
            const api = Browser.api.getAPI();

            // Check if we're in a browser that supports sidePanel
            const browserType = Browser.info.detect();

            if ((browserType === Browser.info.CHROME || browserType === Browser.info.EDGE)
                && api.sidePanel && api.sidePanel.open) {
                try {
                    // Try direct approach - this should work if called directly from user gesture
                    const tabs = await api.tabs.query({ active: true, currentWindow: true });
                    if (tabs[0] && tabs[0].windowId) {
                        await api.sidePanel.open({ windowId: tabs[0].windowId });
                        // Close the popup when sidepanel opens successfully
                        window.close();
                        return; // Success!
                    }
                } catch (error) {
                    console.log('Sidepanel direct open failed (expected in popup context):',
                        error instanceof Error ? error.message : 'Unknown error');
                    // This is expected to fail in popup context due to user gesture requirements
                }
            }

            // Fallback for all browsers: Open collections manager in new tab
            // This always works and provides the same functionality
            const sidepanelUrl = api.runtime.getURL('sidepanel.html');
            await api.tabs.create({
                url: sidepanelUrl,
                active: true
            });

            // Close the popup to avoid confusion
            window.close();

        } catch (error) {
            console.error('Error opening collections manager:', error);
        }
    }

    const openCollection = async (collection: Collection) => {
        const actionKey = `open_${collection.id}`
        setActionStates(prev => ({ ...prev, [actionKey]: true }))

        try {
            const urls = collection.urls.map(item => item.url)
            await createTabsFromUrls(collection.urls, {
                deduplicate: true,
                openInBackground: true
            })

            // Show success feedback
            setTimeout(() => {
                setActionStates(prev => ({ ...prev, [actionKey]: false }))
            }, 1000)
        } catch (error) {
            console.error('Failed to open collection:', error)
            setActionStates(prev => ({ ...prev, [actionKey]: false }))
        }
    }

    const exportAsQR = async (collection: Collection) => {
        const actionKey = `qr_${collection.id}`
        setActionStates(prev => ({ ...prev, [actionKey]: true }))

        try {
            await exportCollectionAsQR(collection)

            // Show success feedback
            setTimeout(() => {
                setActionStates(prev => ({ ...prev, [actionKey]: false }))
            }, 1000)
        } catch (error) {
            console.error('Failed to export QR:', error)
            setActionStates(prev => ({ ...prev, [actionKey]: false }))
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading collections...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header with Manage Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium">Collections</h4>
                    <p className="text-xs text-muted-foreground">
                        {collections.length} saved collection{collections.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={openSidePanel}
                    className="text-xs"
                >
                    <Settings className="h-3 w-3 mr-1" />
                    Manage Collections
                </Button>
            </div>

            {/* Collections List */}
            {collections.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <FolderOpen className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center mb-3">
                            No collections yet
                        </p>
                        <Button size="sm" onClick={openSidePanel} variant="outline">
                            <Plus className="h-3 w-3 mr-1" />
                            Create First Collection
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {collections.map((collection) => (
                        <Card key={collection.id} className="p-3">
                            <div className="space-y-2">
                                {/* Collection Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-medium truncate">{collection.name}</h5>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{collection.urls.length} URL{collection.urls.length !== 1 ? 's' : ''}</span>
                                            <span>•</span>
                                            <span>{formatDate(collection.createdAt)}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {collection.urls.length}
                                    </Badge>
                                </div>

                                {/* Collection Actions */}
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openCollection(collection)}
                                        disabled={actionStates[`open_${collection.id}`]}
                                        className="flex-1 text-xs h-7"
                                    >
                                        {actionStates[`open_${collection.id}`] ? (
                                            <>
                                                <ExternalLink className="h-3 w-3 mr-1 animate-pulse" />
                                                Opening...
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                Open All
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => exportAsQR(collection)}
                                        disabled={actionStates[`qr_${collection.id}`]}
                                        className="text-xs h-7 px-2"
                                    >
                                        {actionStates[`qr_${collection.id}`] ? (
                                            <Download className="h-3 w-3 animate-pulse" />
                                        ) : (
                                            <QrCode className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>

                                {/* URL Preview (first 2-3 URLs) */}
                                {collection.urls.length > 0 && (
                                    <div className="space-y-1">
                                        {collection.urls.slice(0, 2).map((urlItem, index) => (
                                            <div key={index} className="text-xs text-muted-foreground truncate">
                                                {urlItem.title && urlItem.title !== urlItem.url ? (
                                                    <>
                                                        <span className="font-medium">{urlItem.title}</span>
                                                        <span className="text-muted-foreground/70"> - {urlItem.url}</span>
                                                    </>
                                                ) : (
                                                    urlItem.url
                                                )}
                                            </div>
                                        ))}
                                        {collection.urls.length > 2 && (
                                            <div className="text-xs text-muted-foreground/70 italic">
                                                +{collection.urls.length - 2} more URLs
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quick Action */}
            {collections.length > 0 && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={openSidePanel}
                    className="w-full text-xs"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New Collection
                </Button>
            )}
        </div>
    )
}
