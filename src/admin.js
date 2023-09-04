
import './admin.scss'
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { render, useState } from '@wordpress/element';
import { TextControl, Button } from '@wordpress/components';
import TokenList from '@wordpress/token-list';

import { useCopyToClipboard } from './modules/hooks';

render(<App />, document.querySelector( '#bccfg-library-app' ));

function App() {

  return (
    <>
      <ClassLibraryList />
    </>
  );
}

function ClassLibraryList(){

  const { saveEditedEntityRecord } = useDispatch( coreStore );
  const [classLibrary, setClassLibrary, ] = useEntityProp('root', 'site', 'bccfg_class_library');
  const [ customClassInput, setCustomClassInput ] = useState( "" );
  const [ hasCopied, setHasCopied ] = useState( false );
  const [copiedText, copy] = useCopyToClipboard();


  // utility to convert array to tokenlist and return it
  const tokenizedClassLibrary = () => {
    return new TokenList(classLibrary.join(" "))
  }

  const handleDelete = (classNameToRemove) => {
    // Remove the class from our class library
    const newLibrary = classLibrary.filter(item => {
      return item !== classNameToRemove
    })

    updateClassLibrary(newLibrary)
  }

  const updateClassLibrary = (newLibrary) => {
    // update state context 
    setClassLibrary(newLibrary)

    // actually save to DB
    saveEditedEntityRecord( 'root', 'site', undefined, {
      bccfg_class_library: newLibrary,
    } );
  }


  // Listen to keydown and add classes on spacebar or enter key
  const onKeyDown = (e) => {
    // is there a value in the input?
    if(customClassInput.trim().length){

      // Create token list of input and current library
      let classesToAdd = new TokenList(customClassInput)
      let currentLibrary = tokenizedClassLibrary();

      // add in tokens from input (automatically handles duplicates)
      currentLibrary.add(classesToAdd)

      // Convert tokenlist into array
      let updatedLibrary = currentLibrary.value.split(" ")

      // Check for space, enter, or comma
      if ((e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 188)) {
        // do not add spec. char
        e.preventDefault();

        updateClassLibrary(updatedLibrary)

        // empty out input
        setCustomClassInput("")
      }
    }
  };


  // Custom sorting function to ignore case when sorting the classnames
  const sortAlphaCaseInsensitive = (arr) => {
    return [...arr].sort((a, b) => {
      return a.localeCompare(b, undefined, {sensitivity: 'base'});
    });
  }

  const handleCopy = () => {
    setHasCopied(true)
    copy(classLibrary.join(" "))
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <>
      <TextControl
        label="Add classes seperated by commas or spaces"
        placeholder='Enter a class...'
        value={customClassInput}
        onChange={(value) => {
          setCustomClassInput(value);
        }}
        onKeyDown={onKeyDown}
      />



      <div className="better-custom-classes__pill-group">
        {classLibrary && classLibrary.length > 0 ? 
          sortAlphaCaseInsensitive(classLibrary).map((item, idx) => (
            // TODO: Check agaist regex and add an error class to highlight if classname contains illegal chars
            <div key={idx} className={`better-custom-classes__pill`}>
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
          )
        ) : (
          <>
            
          </>
        )}
      </div>

      {classLibrary && classLibrary.length > 0 ? (
        <div>
          <p>Want to import your classes to another site?</p>
          <Button
            className='button button-primary'
            onClick={() => handleCopy()}
          >
            { hasCopied ? 'Copied!' : 'Copy All Classes To Clipboard' }
          </Button>
        </div>
      ) : (
        <></>
      )}

    </>
  )
}