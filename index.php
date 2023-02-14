<?php
/**
 * @version 0.1.1
 */
/*
  Plugin Name: Better Custom Classes for Gutenberg
  Description: A better interface for applying custom classes to blocks in the gutenberg editor.
  Author: Anton Plauche
  Version: 0.1.1
  Author URI: https://antonplauche.com
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

// Uses class instantiation for namespacing
class BetterCustomClassesForGutenberg {

  /**
 * Constructor function 
 *  - adds asset info from build directory 
 *  - hooks into block editor asset enqueue
 */
  function __construct() {
    $this->assetInfo = include(plugin_dir_path( __FILE__ ) .'build/index.asset.php');
    add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
    add_action('activate_plugin', array($this, 'on_activate'));
    add_action( 'admin_init', array($this, 'add_settings'));
    add_action( 'rest_api_init', array($this, 'add_settings') );
  }

  /**
   * Enqueue JS for editor 
   * Enqueue custom styles within block editor for added settings pane
   */
  function adminAssets() {
	  wp_enqueue_script('custom-class-filters', plugin_dir_url(__FILE__) . 'build/index.js', $this->assetInfo['dependencies'], $this->assetInfo['version']);
    wp_enqueue_style( 'custom-class-styles', plugin_dir_url(__FILE__) . 'build/index.css', array(), $this->assetInfo['version']);
  }

  function on_activate() {
      // OPTIONS SETUP
      // first check if options are already there
      $options = get_option( 'bccfg_class_library' );

      // on first activation will return false
      if(!$options){
        add_option( 'bccfg_class_library', '');
      }
  }

  function add_settings(){
    /**
    * Registers a text field setting for Wordpress 4.7 and higher.
    **/
    $args = array(
      'type' => 'string', 
      'sanitize_callback' => 'sanitize_text_field',
      'show_in_rest' => true
      );
    register_setting( 'general', 'bccfg_class_library', $args ); 

  }
}

// Entry Point
new BetterCustomClassesForGutenberg();