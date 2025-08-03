import React from "react"
import { Badge } from "../../../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip"

interface CreateIconProps {
  onClick: (e: React.MouseEvent<HTMLImageElement | HTMLButtonElement>) => void
  index: number
  title: string
  url: string
  favIconUrl?: string
  active: boolean
  isCopied: boolean
}

function CreateIcon({
  onClick,
  index,
  title,
  url,
  favIconUrl,
  active,
  isCopied
}: CreateIconProps) {
  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <img
            onClick={onClick}
            id={index.toString()}
            height={active ? 60 : 40}
            width={active ? 60 : 40}
            src={favIconUrl || "/assets/img/favicon.ico"}
            className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            alt={title}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs truncate">{title}</p>
        </TooltipContent>
      </Tooltip>

      <div className="mt-1">
        {isCopied && (
          <Badge variant="default">
            copied
          </Badge>
        )}
      </div>
    </div>
  )
}

export default CreateIcon
