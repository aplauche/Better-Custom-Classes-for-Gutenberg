=== Better Custom Classes for Gutenberg ===
Contributors: Anton Plauche
Tags: classes, custom, blocks, gutenberg, editor
Requires at least: 6.0
Tested up to: 6.0
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Better Custom Classes for Gutenberg adds a new custom classes pane in the block options panel. This field behaves similar to tags for a better custom class UX.

== Description ==
Adds an extra "Custom Classes" pane to gutenberg blocks that behaves similar to tags. This allows for easy entry, deletion, and managment of utility classes on your blocks. A regex validator highlights classes that may be invalid. A "Copy All" button is also added for quickly transferring classes between blocks.
On deactivation, classes will persist, but in the legacy Custom Class field under the advanced pane.

Clicking the star icon on a class will toggle whether to include it in your class library. This makes it show up as an autocomplete when applying classes to other blocks. You can view all the classes in your library on the dedicated class library settings page in the admin.

== Installation ==
1. Extract better-custom-classes-for-gutenberg.zip
2. Upload the plugin folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the \'Plugins\' menu in WordPress

== Screenshots ==
1. Easily viewing classes with the Custom Class Pane
2. An invalid class highlighted where the user added a period

== Changelog ==

= 0.1.3 =
* Add colon to supported class characters for tailwind utils etc.

= 0.1.2 =
* Fix bug with WP 6.3 where saving on general options page throws error

= 0.1.1 =
* Add a filter to bail out if block does not support customClassName

= 0.1 =
* Initial plugin release