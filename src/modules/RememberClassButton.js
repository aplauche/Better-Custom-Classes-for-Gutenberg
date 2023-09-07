

import { Icon, starFilled, starEmpty } from '@wordpress/icons';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { store as coreStore } from '@wordpress/core-data';


import TokenList from '@wordpress/token-list';



const RememberClassButton = ({item}) => {

  const [classLibrary, setClassLibrary] = useEntityProp('root', 'site', 'bccfg_class_library')

  const { saveEditedEntityRecord } = useDispatch( coreStore );

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

  return (
    <>
      {classLibrary && classLibrary?.includes(item) ? (
        <Icon width={20} height={20} icon={ starFilled } onClick={() => handleDontRememberClick(item)}/>
      ) : (
        <Icon width={20} height={20} icon={ starEmpty } onClick={() => handleRememberClick(item)}/>
      )}
    </>
  )
}

export default RememberClassButton
