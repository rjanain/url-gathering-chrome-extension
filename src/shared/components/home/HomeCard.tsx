import React, { useEffect, useState } from "react"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent } from "../../../components/ui/card"
import { QrCode, Download, Save, X } from "lucide-react"
// @ts-ignore - JavaScript utility imports
import { getTabs } from "../../../utils/chromeAPI.js"
// @ts-ignore - JavaScript utility imports
import { getLink } from "../../../utils/copyAPI.js"
// @ts-ignore - JavaScript utility imports
import { Browser } from "../../../utils/browser.js"
// @ts-ignore - JavaScript utility imports
import { downloadQRCodeSVG, createQRCodeZip, downloadCombinedQRCodeSVG } from "../../../utils/qrExport.js"
// @ts-ignore - JavaScript utility imports
import { getQRExportMode } from "../../../utils/settingsStorage.js"
// @ts-ignore - JavaScript utility imports
import { saveCollection } from "../../../utils/collectionsStorage.js"
import CopyAllButton from "./icon/CopyAllButton"
import CreateIcon from "./icon/Icon"

interface Tab {
  id: number
  title: string
  url: string
  favIconUrl?: string
  active: boolean
  highlighted: boolean
}

interface CopyRequest {
  [key: string]: boolean
}

export const HomeCard = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [copyRequest, setCopyRequest] = useState<CopyRequest>({})
  const [isExportingQR, setIsExportingQR] = useState(false)
  const [showSaveCollection, setShowSaveCollection] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [isSavingCollection, setIsSavingCollection] = useState(false)

  useEffect(() => {
    getTabs().then((res: Tab[]) => {
      console.log(res)
      setTabs(res)
    })
  }, [])

  const handleListClickEvent = async (e: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => {
    // Capture event properties synchronously before any async operations
    const targetId = e.currentTarget?.id;
    const targetElement = e.currentTarget;

    // Add defensive check for currentTarget
    if (!targetElement || !targetId) {
      console.error("Event currentTarget or id is null", e);
      return;
    }

    console.log("You have clicked: " + targetId)
    console.log(e)

    let filteredTabs = tabs;

    if (targetId === 'copyHighlighted') {
      // Remove all non-highlighted tabs
      filteredTabs = tabs.filter((el) => el.highlighted)
    }

    // Use browser-specific clipboard handling
    try {
      const linkText = await getLink(targetId, filteredTabs);
      const copySuccess = await Browser.quirks.copyToClipboard(linkText);

      if (!copySuccess) {
        console.error('Failed to copy to clipboard');
        return;
      }

      setCopyRequest({
        [targetId]: true
      })
    } catch (error) {
      console.error('Error in handleListClickEvent:', error);
    }

    setTimeout(() => {
      // Removed copied badge after few seconds
      setCopyRequest({
        [targetId]: false
      })
    }, 1000)
  }

  const handleQRExport = async (type: 'all' | 'highlighted') => {
    setIsExportingQR(true)

    try {
      let urlsToExport = tabs;

      if (type === 'highlighted') {
        urlsToExport = tabs.filter(tab => tab.highlighted);
      }

      if (urlsToExport.length === 0) {
        console.warn('No URLs to export');
        return;
      }

      // Convert tabs to URL objects format
      const urls = urlsToExport.map(tab => ({
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl
      }));

      if (urls.length === 1) {
        // Single URL - always export as individual SVG
        await downloadQRCodeSVG(urls[0].url, 'linkpilot-qr.svg');
      } else {
        // Multiple URLs - check user preference
        const qrExportMode = await getQRExportMode();

        if (qrExportMode === 'single') {
          // Export as single combined QR code
          const filename = type === 'all' ? 'linkpilot-all-tabs-qr.svg' : 'linkpilot-highlighted-tabs-qr.svg';
          await downloadCombinedQRCodeSVG(urls, filename);
        } else {
          // Export as ZIP with separate QR codes
          const filename = type === 'all' ? 'linkpilot-all-tabs-qr-codes.zip' : 'linkpilot-highlighted-tabs-qr-codes.zip';
          const urlStrings = urls.map(urlObj => urlObj.url);
          await createQRCodeZip(urlStrings, filename);
        }
      }

      // Show success feedback
      setCopyRequest({
        [`qr_${type}`]: true
      });

      setTimeout(() => {
        setCopyRequest({
          [`qr_${type}`]: false
        });
      }, 2000);

    } catch (error) {
      console.error('Failed to export QR codes:', error);
    } finally {
      setIsExportingQR(false);
    }
  }

  const handleSaveAsCollection = async (type: 'all' | 'highlighted') => {
    setIsSavingCollection(true)

    try {
      let tabsToSave = tabs;

      if (type === 'highlighted') {
        tabsToSave = tabs.filter(tab => tab.highlighted);
      }

      if (tabsToSave.length === 0) {
        console.warn('No tabs to save');
        return;
      }

      const urls = tabsToSave.map(tab => ({
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl
      }));

      const defaultName = type === 'highlighted'
        ? `Highlighted Tabs (${urls.length})`
        : `All Tabs (${urls.length})`;

      const collection = await saveCollection({
        name: collectionName.trim() || defaultName,
        urls,
        source: 'current_tabs'
      });

      if (collection) {
        // Show success feedback
        setCopyRequest({
          [`save_${type}`]: true
        });

        setTimeout(() => {
          setCopyRequest({
            [`save_${type}`]: false
          });
        }, 2000);

        // Reset form
        setShowSaveCollection(false);
        setCollectionName('');
      }
    } catch (error) {
      console.error('Failed to save collection:', error);
    } finally {
      setIsSavingCollection(false);
    }
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          The icon of the active page will appear larger than other icons.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between mb-4">
        {tabs
          ? tabs.map((el) => {
              return (
                <CreateIcon
                  onClick={handleListClickEvent}
                  key={el.id}
                  tabId={el.id}
                  title={el?.title}
                  url={el?.url}
                  favIconUrl={el?.favIconUrl}
                  active={el?.active}
                  isCopied={copyRequest[el.id]}
                />
              )
            })
          : null
        }
      </div>

      <div className="flex flex-col gap-2">
        <CopyAllButton
          onClick={handleListClickEvent}
          isCopied={copyRequest["copyAll"]}
          text={"Copy All"}
          variant="outline"
          id="copyAll"
        />

        {tabs.filter(el => el.highlighted).length > 0 ? (
          <CopyAllButton
            onClick={handleListClickEvent}
            variant="outline"
            isCopied={copyRequest["copyHighlighted"]}
            id="copyHighlighted"
            text={"Copy Highlighted"}
          />
        ) : null}

        {/* QR Export and Save Collection Buttons */}
        <div className="space-y-2">
          {/* QR Export Row */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQRExport('all')}
              disabled={isExportingQR || tabs.length === 0}
              className="flex-1"
            >
              {isExportingQR ? (
                <Download className="h-4 w-4 mr-2 animate-pulse" />
              ) : (
                <QrCode className="h-4 w-4 mr-2" />
              )}
              QR All
            </Button>

            {tabs.filter(el => el.highlighted).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQRExport('highlighted')}
                disabled={isExportingQR}
                className="flex-1"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Highlighted
              </Button>
            )}
          </div>

          {/* Save Collection Row */}
          {!showSaveCollection && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveCollection(true)}
                disabled={tabs.length === 0 || isSavingCollection}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>

              {tabs.filter(el => el.highlighted).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveCollection(true)}
                  disabled={isSavingCollection}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Highlighted
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Save Collection Form */}
        {showSaveCollection && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="collection-name-home" className="text-sm">
                    Collection Name
                  </Label>
                  <Input
                    id="collection-name-home"
                    placeholder="Enter collection name..."
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    disabled={isSavingCollection}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveAsCollection('all')}
                    disabled={isSavingCollection}
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
                        Save All ({tabs.length})
                      </>
                    )}
                  </Button>

                  {tabs.filter(el => el.highlighted).length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleSaveAsCollection('highlighted')}
                      disabled={isSavingCollection}
                      className="flex-1"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save Highlighted ({tabs.filter(el => el.highlighted).length})
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowSaveCollection(false)
                      setCollectionName('')
                    }}
                    disabled={isSavingCollection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}        {/* Success Messages */}
        {(copyRequest["copyHighlighted"] || copyRequest["copyAll"]) ? (
          <div className="mt-2">
            <Badge variant="default">
              All URLs have been copied
            </Badge>
          </div>
        ) : null}

        {(copyRequest["qr_all"] || copyRequest["qr_highlighted"]) ? (
          <div className="mt-2">
            <Badge variant="default" className="bg-green-600">
              QR code exported successfully
            </Badge>
          </div>
        ) : null}

        {(copyRequest["save_all"] || copyRequest["save_highlighted"]) ? (
          <div className="mt-2">
            <Badge variant="default" className="bg-blue-600">
              Collection saved successfully
            </Badge>
          </div>
        ) : null}
      </div>
    </>
  );
}
