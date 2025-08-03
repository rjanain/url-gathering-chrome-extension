import React, { useEffect, useState } from "react"
import { Switch } from "../../../../components/ui/switch"
import { Label } from "../../../../components/ui/label"
import { saveToChromeStorage } from "../../../../utils"
import ShowToast from "./ShowToast"

// Use webextension-polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

interface OptionFormState {
  format?: string
  includeName?: boolean
}

interface Notifications {
  changed?: string
  [key: string]: any
}

const OptionForm = () => {
  const [optionform, setOptionform] = useState<OptionFormState>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [notifications, setNotifications] = useState<Notifications>({})
  const [show, setShow] = useState(false);

  useEffect(() => {
    browser.storage.sync.get(null).then((result: OptionFormState) => {
      setOptionform(result)
      console.log("Fetched result from storage", result)
    }).catch((error: Error) => {
      console.error("Failed to fetch from storage:", error)
    })
  }, [])

  const setField = (field: string, value: string | boolean) => {
    console.log(field, value)
    saveToChromeStorage(field, value)
    setNotifications({
      ...notifications,
      "changed": field,
      [field]: value
    })
    setOptionform({
      ...optionform,
      [field]: value
    })
    setShow(true)

    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      })
    }
  }

  return (
    <div className="space-y-6">
      <ShowToast notifications={notifications} show={show} setShow={setShow} />

      <form id="optionForm" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Select Output Format</Label>
          <select
            id="format"
            value={optionform?.format || "plaintext"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Choose your preferred format type"
            onChange={e => { setField(e.target.id, e.target.value) }}
          >
            <option value="plaintext">PlainText</option>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeName"
            checked={optionform?.includeName !== undefined ? optionform.includeName : false}
            onCheckedChange={(checked: boolean) => setField("includeName", checked)}
          />
          <Label htmlFor="includeName">Include Page Title</Label>
        </div>
      </form>
    </div>
  )
}

export default OptionForm
