import React from "react"
import { Button } from "../../../../components/ui/button"
import { Check } from "lucide-react"

interface CopyAllButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  id: string
  onClick: (e: React.MouseEvent<HTMLButtonElement | HTMLImageElement>) => void
  isCopied: boolean
  text: string
}

const CopyAllButton: React.FC<CopyAllButtonProps> = ({
  variant = "default",
  id,
  onClick,
  isCopied,
  text
}) => {
  return (
    <Button
      size="sm"
      variant={variant}
      id={id}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      {isCopied && (
        <Check className="h-4 w-4" />
      )}
      {text}
    </Button>
  )
}

export default CopyAllButton
