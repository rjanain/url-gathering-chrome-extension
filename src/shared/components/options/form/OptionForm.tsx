import React, { useEffect, useReducer } from "react"
import { Switch } from "../../../../components/ui/switch"
import { Label } from "../../../../components/ui/label"
// @ts-ignore - JavaScript utility imports
import { saveToChromeStorage } from "../../../../utils/handlerStorage.js"
// @ts-ignore - JavaScript utility imports
import { getAllSettings, saveSetting } from "../../../../utils/settingsStorage.js"
import ShowToast from "./ShowToast"

// Use webextension-polyfill for cross-browser compatibility
import browser from 'webextension-polyfill';

interface OptionFormState {
  format?: string
  includeName?: boolean
  qrExportMode?: string
}

interface Notifications {
  changed?: string
  [key: string]: any
}

// State management types
type State = {
  form: OptionFormState
  errors: Record<string, string | null>
  notifications: Notifications
  showToast: boolean
}

type Action =
  | { type: "SET_FIELD"; field: string; value: any }
  | { type: "LOAD"; payload: OptionFormState }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "HIDE_TOAST" }

const initialState: State = {
  form: {},
  errors: {},
  notifications: {},
  showToast: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return { ...state, form: action.payload }
    case "SET_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: null },
        notifications: { changed: action.field, [action.field]: action.value },
        showToast: true,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: null }
      }
    case "HIDE_TOAST":
      return {
        ...state,
        showToast: false
      }
    default:
      return state
  }
}

const OptionForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load once from storage
  useEffect(() => {
    getAllSettings()
      .then((result: OptionFormState) => {
        dispatch({ type: "LOAD", payload: result })
        console.log("Fetched result from storage", result)
      })
      .catch((error: Error) => {
        console.error("Failed to fetch from storage:", error)
      })
  }, [])

  // Handle field change: purely dispatch + side-effect
  const setField = (field: string, value: string | boolean) => {
    console.log(field, value)
    dispatch({ type: "SET_FIELD", field, value })

    // Use appropriate storage method
    if (field === 'qrExportMode') {
      saveSetting(field, value)
    } else {
      saveToChromeStorage(field, value)
    }
  }

  const handleHideToast = () => {
    dispatch({ type: "HIDE_TOAST" })
  }

  return (
    <div className="space-y-6">
      <ShowToast
        notifications={state.notifications}
        show={state.showToast}
        setShow={handleHideToast}
      />

      <form id="optionForm" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Select Output Format</Label>
          <select
            id="format"
            value={state.form?.format || "plaintext"}
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
            checked={!!state.form?.includeName}
            onCheckedChange={(checked: boolean) => setField("includeName", checked)}
          />
          <Label htmlFor="includeName">Include Page Title</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qrExportMode">QR Code Export Mode</Label>
          <select
            id="qrExportMode"
            value={state.form?.qrExportMode || "single"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Choose QR code export behavior"
            onChange={e => { setField(e.target.id, e.target.value) }}
          >
            <option value="single">Single QR (Combined URLs)</option>
            <option value="separate">Separate QRs (ZIP File)</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Single QR: All URLs in one QR code (recommended).
            Separate QRs: Each URL gets its own QR code in a ZIP file.
          </p>
        </div>
      </form>
    </div>
  )
}

export default OptionForm
