import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Switch } from '../../../components/ui/switch'
import { Input } from '../../../components/ui/input'
import { AlertCircle, Upload, ExternalLink, Save } from 'lucide-react'
// @ts-ignore - JavaScript utility imports
import { importAndCreateTabs, validateImportText } from '../../../utils/importUrls.js'
// @ts-ignore - JavaScript utility imports
import { saveCollection } from '../../../utils/collectionsStorage.js'

interface ImportResult {
  parsed?: number
  success: number
  failed: number
  skipped: number
  errors: (string | { url: string; error: string })[]
}

interface ValidationPreview {
  isValid: boolean
  urlCount: number
  urls: { url: string; title: string; originalText: string }[]
  hasMore: boolean
  errors: string[]
}

export const ImportCard = () => {
  const [importText, setImportText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [preview, setPreview] = useState<ValidationPreview | null>(null)
  const [deduplicate, setDeduplicate] = useState(true)
  const [openInBackground, setOpenInBackground] = useState(true)
  const [showSaveCollection, setShowSaveCollection] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [isSavingCollection, setIsSavingCollection] = useState(false)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setImportText(text)

    // Clear previous results
    setImportResult(null)

    // Generate preview if text is provided
    if (text.trim()) {
      const validation = validateImportText(text)
      setPreview(validation)
    } else {
      setPreview(null)
    }
  }

  const handleImport = async () => {
    if (!importText.trim()) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const result = await importAndCreateTabs(importText, {
        deduplicate,
        openInBackground,
        maxTabs: 20
      })

      setImportResult(result)

      // Clear text on successful import
      if (result.success > 0) {
        setImportText('')
        setPreview(null)
      }
    } catch (error) {
      console.error('Import failed:', error)
      setImportResult({
        success: 0,
        failed: 1,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClear = () => {
    setImportText('')
    setPreview(null)
    setImportResult(null)
    setShowSaveCollection(false)
    setCollectionName('')
  }

  const handleSaveAsCollection = async () => {
    if (!collectionName.trim() || !preview?.urls) return

    setIsSavingCollection(true)

    try {
      const urls = preview.urls.map(urlObj => ({
        url: urlObj.url,
        title: urlObj.title,
        favIconUrl: undefined // We don't have favicons from text import
      }))

      const collection = await saveCollection({
        name: collectionName.trim(),
        urls,
        source: 'import_text'
      })

      if (collection) {
        // Show success and reset form
        setShowSaveCollection(false)
        setCollectionName('')

        // You could show a success message here
        console.log('Collection saved successfully:', collection.name)
      }
    } catch (error) {
      console.error('Failed to save collection:', error)
    } finally {
      setIsSavingCollection(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="import-text">Paste URLs (newline or CSV separated)</Label>
        <Textarea
          id="import-text"
          placeholder="https://example.com&#10;https://google.com&#10;Title, https://github.com"
          value={importText}
          onChange={handleTextChange}
          className="min-h-[120px] resize-none"
        />
      </div>

      {/* Preview */}
      {preview && (
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {preview.isValid ? (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Preview ({preview.urlCount} URLs found)
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  No valid URLs found
                </>
              )}
            </CardTitle>
          </CardHeader>
          {preview.isValid && (
            <CardContent className="pt-0">
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {preview.urls.map((urlObj, index) => (
                  <div key={index} className="text-xs text-muted-foreground truncate">
                    {urlObj.title !== urlObj.url ? (
                      <>
                        <span className="font-medium">{urlObj.title}</span> - {urlObj.url}
                      </>
                    ) : (
                      urlObj.url
                    )}
                  </div>
                ))}
                {preview.hasMore && (
                  <div className="text-xs text-muted-foreground italic">
                    ... and {preview.urlCount - 10} more
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="deduplicate" className="text-sm">
            Skip already open URLs
          </Label>
          <Switch
            id="deduplicate"
            checked={deduplicate}
            onCheckedChange={setDeduplicate}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="background" className="text-sm">
            Open in background
          </Label>
          <Switch
            id="background"
            checked={openInBackground}
            onCheckedChange={setOpenInBackground}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleImport}
          disabled={!preview?.isValid || isImporting}
          className="flex-1"
        >
          {isImporting ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Creating Tabs...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Import & Open
            </>
          )}
        </Button>

        {preview?.isValid && !showSaveCollection && (
          <Button
            variant="outline"
            onClick={() => setShowSaveCollection(true)}
            disabled={isImporting}
            size="sm"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}

        {importText && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isImporting}
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Save Collection Form */}
      {showSaveCollection && preview?.isValid && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="collection-name" className="text-sm">
                  Save as Collection
                </Label>
                <Input
                  id="collection-name"
                  placeholder="Enter collection name..."
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  disabled={isSavingCollection}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveAsCollection}
                  disabled={!collectionName.trim() || isSavingCollection}
                  className="flex-1"
                >
                  {isSavingCollection ? (
                    <>
                      <Save className="h-3 w-3 mr-1 animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 mr-1" />
                      Save Collection
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowSaveCollection(false)
                    setCollectionName('')
                  }}
                  disabled={isSavingCollection}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {importResult && (
        <Card className={importResult.success > 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {importResult.parsed && importResult.parsed > 0 && (
                  <Badge variant="secondary">
                    {importResult.parsed} URLs parsed
                  </Badge>
                )}
                {importResult.success > 0 && (
                  <Badge variant="default" className="bg-green-600">
                    {importResult.success} tabs created
                  </Badge>
                )}
                {importResult.skipped > 0 && (
                  <Badge variant="outline">
                    {importResult.skipped} skipped (already open)
                  </Badge>
                )}
                {importResult.failed > 0 && (
                  <Badge variant="destructive">
                    {importResult.failed} failed
                  </Badge>
                )}
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Errors:</div>
                  {importResult.errors.slice(0, 3).map((error, index) => (
                    <div key={index} className="truncate">
                      {typeof error === 'string' ? error : `${error.url}: ${error.error}`}
                    </div>
                  ))}
                  {importResult.errors.length > 3 && (
                    <div>... and {importResult.errors.length - 3} more errors</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
