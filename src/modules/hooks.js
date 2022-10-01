import { useState } from 'react'


export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null)

  const copy = async text => {
    if (!navigator?.clipboard) {
      alert(`Clipboard not supported - you can manually copy here: ${text}`)
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      alert('Sorry, an error occured. You can always copy classes from the legacy advanced options text field.')
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}


