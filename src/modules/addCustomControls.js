import { InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow, Button } from '@wordpress/components';
import { Icon, starFilled, starEmpty } from '@wordpress/icons';

import { useState, Fragment, useEffect } from '@wordpress/element';

import { store as blocksStore } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp, store as coreStore } from '@wordpress/core-data';

import TokenList from '@wordpress/token-list';

import { useCopyToClipboard } from './hooks';



const addCustomControls = wp.compose.createHigherOrderComponent((BlockEdit) => {

	return (props) => {

		const { name, attributes, setAttributes, isSelected } = props;
    const [ hasCopied, setHasCopied ] = useState( false );
    const [ customClassInput, setCustomClassInput ] = useState( "" );
    const [copiedText, copy] = useCopyToClipboard();

    const { saveEditedEntityRecord } = useDispatch( coreStore );

    // Regex to validate classes added do not contain illegal characters
    const regexp = /^[a-zA-Z0-9-_:]+$/;

    // Access class library for autocomplete
    const [classLibrary, setClassLibrary] = useEntityProp('root', 'site', 'bccfg_class_library')
    const [suggestions, setSuggestions] = useState([])

    // UTILITY FUNCTIONS

    // utility to provide classlist as array
    const currentClassArray = () => {

      if(typeof attributes.className !== 'undefined' && attributes.className.trim() !== ""){
        return attributes.className.trim().split(" ")
      } 

      return []
    }

    // Check for block support and bail out if none exists
    const blockSupportValue = useSelect(
      ( select ) =>
          select( blocksStore ).getBlockSupport( name, 'customClassName' ),
      [name]
    );

    if(blockSupportValue === false){
      // Bail out - no support
      return <BlockEdit {...props} />
    }


    // Filter possible suggestions
    useEffect(() => {
      if(customClassInput.length > 2){

        // only classes that match input - we lowercase all just to include suggestions that are not case matched
        let filtered = classLibrary?.filter(item => {
          return item.toLowerCase().includes(customClassInput.toLowerCase())
        })

        // only classes that aren't already there
        filtered = filtered.filter(item => {
          return !currentClassArray().includes(item)
        })

        setSuggestions(filtered)
      } else {
        setSuggestions([])
      }

    }, [customClassInput, classLibrary])

    // Listen to keydown and add classes on spacebar or enter or comma key
    const onKeyDown = (e) => {
      if(customClassInput.trim().length){

        // Create token list of input and current library
        let classesToAdd = new TokenList(customClassInput)
        let blockClassList = new TokenList(attributes.className)

        // add in tokens from input (automatically handles duplicates)
        blockClassList.add(classesToAdd)
  
        if ((e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 188)) {
          e.preventDefault();

          // Merge in new classes
          setAttributes({className: blockClassList.value})

          // empty out input
          setCustomClassInput("")

        }
      }
    };

    const handleSuggestionClick = (term) => {

      let blockClassList = new TokenList(attributes.className)
      blockClassList.add(term)

      setAttributes({className: blockClassList.value})

      // empty out input
      setCustomClassInput("")
    }

    const handleDelete = (deletedClass) => {

      let blockClassList = new TokenList(attributes.className)
      blockClassList.remove(deletedClass)

      setAttributes({className: blockClassList.value})
    }


    // Handlers for the remember/don't remember logic

    const updateLibrary = (newLibrary) => {
      setClassLibrary(newLibrary)
      saveEditedEntityRecord( 'root', 'site', undefined, {
        bccfg_class_library: newLibrary,
      } );
    }

    const handleRememberClick = (item) => {
        // If no classes exist yet just add directly
        if(!classLibrary || classLibrary.length < 1){
          updateLibrary([item])
          return;
        }

        // otherwise merge into array
        let classLibraryTokenList = new TokenList(classLibrary.join(" "))
        classLibraryTokenList.add(item)

        const newArray = classLibraryTokenList.value.split(" ")
        
        updateLibrary(newArray)
    }

    const handleDontRememberClick = (item) => {
      const newArray = classLibrary.filter(term => {
        return term !== item
      })
      updateLibrary(newArray)
    }

    const handleCopy = () => {
      setHasCopied(true)
      copy(attributes.className)
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    }

		return (
			<Fragment>
				<BlockEdit {...props} />
				{isSelected && 
					<InspectorControls>
            <PanelBody title="Custom Classes" initialOpen={true}>
              <PanelRow>
                <div style={{position: "relative"}}>

                <TextControl
                  label="Add a class then press space or enter"
                  value={customClassInput}
                  onChange={(value) => {
                    setCustomClassInput(value);
                  }}
                  onKeyDown={onKeyDown}
                />
                <ul className='bccfg-suggestions'>
                  {suggestions.map(term => (
                    <li key={term} onClick={() => handleSuggestionClick(term)}>
                      {term}
                    </li>
                  ))}
                </ul>              
                </div>

                
              </PanelRow>
              <PanelRow>
                <div className="better-custom-classes__pill-group">
                  {currentClassArray().map((item, idx) => (
                    // Check agaist regex and add an error class to highlight if classname contains illegal chars
                    <div key={idx} className={`better-custom-classes__pill ${item.search(regexp) === -1 ? 'better-custom-classes__pill--error' : ''}`}>
                      {classLibrary && classLibrary.includes(item) ? (
                        <Icon width={20} height={20} icon={ starFilled } onClick={() => handleDontRememberClick(item)}/>
                      ) : (
                        <Icon width={20} height={20} icon={ starEmpty } onClick={() => handleRememberClick(item)}/>
                      )}
                      {item}
                      <svg className="better-custom-classes__pill-delete" version="1.1" x="0px" y="0px"
                        viewBox="0 0 460.775 460.775"
                        onClick={()=>handleDelete(item)}
                      >
                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                          c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                          c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                          c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                          l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                          c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </PanelRow>
              {currentClassArray().length > 0 && 
                // If custom classes exist show a copy to clipboard button to allow easy copying between blocks
                <PanelRow>
                  <Button
                    variant="primary"
                    onClick={() => handleCopy()}
                  >
                    { hasCopied ? 'Copied!' : 'Copy All Classes' }
                  </Button>
                </PanelRow>
              }
            </PanelBody>
          </InspectorControls>
				}
			</Fragment>
		);
	};
}, 'addCustomControls');


export default addCustomControls;