import "./index.scss";

import addCustomControls from "./modules/addCustomControls"

// Add the custom class control panel to editor
wp.hooks.addFilter(
	'editor.BlockEdit',
	'bccfg/add-custom-controls',
	addCustomControls,
  9999
);
 
