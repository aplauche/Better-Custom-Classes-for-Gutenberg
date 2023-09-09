import { useCopyToClipboard } from './hooks';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

const CopyButton = ({textToCopy}) => {

  const [copiedText, copy] = useCopyToClipboard();
  const [ hasCopied, setHasCopied ] = useState( false );

  const handleCopy = () => {
    setHasCopied(true)
    copy(textToCopy)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <Button
      variant="primary"
      onClick={() => handleCopy()}
    >
      { hasCopied ? 'Copied!' : 'Copy All Classes' }
    </Button>
  )
}

export default CopyButton
