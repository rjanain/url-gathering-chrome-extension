import React, { useEffect, useState } from "react"
import { Badge } from "../../../components/ui/badge"
import { getTabs, getLink, Browser } from "../../../utils"
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

  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          The icon of the active page will appear larger than other icons.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between mb-4">
        {tabs
          ? tabs.map((el, index) => {
              return (
                <CreateIcon
                  onClick={handleListClickEvent}
                  key={index}
                  index={index}
                  title={el?.title}
                  url={el?.url}
                  favIconUrl={el?.favIconUrl}
                  active={el?.active}
                  isCopied={copyRequest[index]}
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

        {(copyRequest["copyHighlighted"] || copyRequest["copyAll"]) ? (
          <div className="mt-2">
            <Badge variant="default">
              All URLs have been copied
            </Badge>
          </div>
        ) : null}
      </div>
    </>
  );
}
