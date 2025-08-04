import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Settings,
    ExternalLink,
    QrCode,
    Download,
    Plus,
    FolderOpen,
    GripVertical,
    MoreVertical,
    Edit3,
    Trash2,
} from "lucide-react";
// @ts-ignore - JavaScript utility imports
import {
    getAllCollections,
    saveCollection,
    updateCollection,
    deleteCollection,
    reorderCollections,
    createCollectionFromCurrentTabs,
} from "../../../utils/collectionsStorage.js";
// @ts-ignore - JavaScript utility imports
import { createTabsFromUrls } from "../../../utils/importUrls.js";
// @ts-ignore - JavaScript utility imports
import { exportCollectionAsQR } from "../../../utils/qrExport.js";

interface Collection {
    id: string;
    name: string;
    urls: { url: string; title: string; favIconUrl?: string }[];
    createdAt: string;
    updatedAt: string;
    source?: string;
}

export const CollectionsPanel = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionStates, setActionStates] = useState<{ [key: string]: boolean }>(
        {}
    );
    const [newCollectionName, setNewCollectionName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        try {
            const savedCollections = await getAllCollections();
            setCollections(savedCollections);
        } catch (error) {
            console.error("Failed to load collections:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFromCurrentTabs = async () => {
        if (!newCollectionName.trim()) return;

        setIsCreating(true);
        try {
            const collection = await createCollectionFromCurrentTabs(
                newCollectionName.trim()
            );
            if (collection) {
                setCollections((prev) => [collection, ...prev]);
                setNewCollectionName("");
            }
        } catch (error) {
            console.error("Failed to create collection:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCreateEmpty = async () => {
        if (!newCollectionName.trim()) return;

        setIsCreating(true);
        try {
            const collection = await saveCollection({
                name: newCollectionName.trim(),
                urls: [],
                source: "manual",
            });
            if (collection) {
                setCollections((prev) => [collection, ...prev]);
                setNewCollectionName("");
            }
        } catch (error) {
            console.error("Failed to create collection:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleRename = async (id: string) => {
        if (!editingName.trim()) return;

        try {
            await updateCollection(id, { name: editingName.trim() });
            setCollections((prev) =>
                prev.map((col) =>
                    col.id === id ? { ...col, name: editingName.trim() } : col
                )
            );
            setEditingId(null);
            setEditingName("");
        } catch (error) {
            console.error("Failed to rename collection:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCollection(id);
            setCollections((prev) => prev.filter((col) => col.id !== id));
        } catch (error) {
            console.error("Failed to delete collection:", error);
        }
    };

    const startEditing = (collection: Collection) => {
        setEditingId(collection.id);
        setEditingName(collection.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
        }

        const newCollections = [...collections];
        const draggedItem = newCollections[draggedIndex];

        // Remove from old position
        newCollections.splice(draggedIndex, 1);

        // Insert at new position
        newCollections.splice(dropIndex, 0, draggedItem);

        setCollections(newCollections);
        setDraggedIndex(null);

        // Save new order
        try {
            await reorderCollections(newCollections);
        } catch (error) {
            console.error("Failed to save collection order:", error);
            // Revert on error
            loadCollections();
        }
    };

    const openCollection = async (collection: Collection) => {
        const actionKey = `open_${collection.id}`;
        setActionStates((prev) => ({ ...prev, [actionKey]: true }));

        try {
            const urls = collection.urls.map((item) => item.url);
            await createTabsFromUrls(collection.urls, {
                deduplicate: true,
                openInBackground: true,
            });

            // Show success feedback
            setTimeout(() => {
                setActionStates((prev) => ({ ...prev, [actionKey]: false }));
            }, 1000);
        } catch (error) {
            console.error("Failed to open collection:", error);
            setActionStates((prev) => ({ ...prev, [actionKey]: false }));
        }
    };

    const exportAsQR = async (collection: Collection) => {
        const actionKey = `qr_${collection.id}`;
        setActionStates((prev) => ({ ...prev, [actionKey]: true }));

        try {
            await exportCollectionAsQR(collection);

            // Show success feedback
            setTimeout(() => {
                setActionStates((prev) => ({ ...prev, [actionKey]: false }));
            }, 1000);
        } catch (error) {
            console.error("Failed to export QR:", error);
            setActionStates((prev) => ({ ...prev, [actionKey]: false }));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                    Loading collections...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold mb-1">Collections Manager</h2>
                <p className="text-sm text-muted-foreground">
                    Organize and manage your saved URL collections
                </p>
            </div>

            {/* Create New Collection */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        Create New Collection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        placeholder="Enter collection name..."
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && newCollectionName.trim()) {
                                handleCreateFromCurrentTabs();
                            }
                        }}
                        className="text-sm"
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleCreateFromCurrentTabs}
                            disabled={!newCollectionName.trim() || isCreating}
                            className="flex-1 text-xs"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            {isCreating ? "Creating..." : "From Current Tabs"}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCreateEmpty}
                            disabled={!newCollectionName.trim() || isCreating}
                            className="text-xs"
                        >
                            Empty
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Header with Collection Count */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium">Collections</h4>
                    <p className="text-xs text-muted-foreground">
                        {collections.length} saved collection
                        {collections.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Collections List */}
            {collections.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <FolderOpen className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center mb-3">
                            No collections yet
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                            Create your first collection above
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {collections.map((collection, index) => (
                        <Card
                            key={collection.id}
                            className="p-3"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <div className="space-y-2">
                                {/* Collection Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-move" />
                                        <div className="flex-1 min-w-0">
                                            {editingId === collection.id ? (
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleRename(collection.id);
                                                        if (e.key === "Escape") cancelEditing();
                                                    }}
                                                    onBlur={() => handleRename(collection.id)}
                                                    className="h-6 text-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <>
                                                    <h5 className="text-sm font-medium truncate">
                                                        {collection.name}
                                                    </h5>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            {collection.urls.length} URL
                                                            {collection.urls.length !== 1 ? "s" : ""}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{formatDate(collection.createdAt)}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {collection.urls.length}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <MoreVertical className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => startEditing(collection)}
                                                >
                                                    <Edit3 className="h-3 w-3 mr-2" />
                                                    Rename Collection
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openCollection(collection)}
                                                >
                                                    <ExternalLink className="h-3 w-3 mr-2" />
                                                    Open All URLs
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => exportAsQR(collection)}
                                                >
                                                    <QrCode className="h-3 w-3 mr-2" />
                                                    Export as QR
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(collection.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-2" />
                                                    Delete Collection
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
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
                                        {collection.urls.slice(0, 2).map((urlItem, urlIndex) => (
                                            <div
                                                key={urlIndex}
                                                className="text-xs text-muted-foreground truncate"
                                            >
                                                {urlItem.title && urlItem.title !== urlItem.url ? (
                                                    <>
                                                        <span className="font-medium">{urlItem.title}</span>
                                                        <span className="text-muted-foreground/70">
                                                            {" "}
                                                            - {urlItem.url}
                                                        </span>
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
        </div>
    );
};
