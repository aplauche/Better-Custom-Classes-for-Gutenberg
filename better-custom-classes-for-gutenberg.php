<?php

/**
 * @version 0.2.2
 */
/*
  Plugin Name: Better Custom Classes for Gutenberg
  Description: A better interface for applying custom classes to blocks in the gutenberg editor.
  Author: Anton Plauche
  Version: 0.2.2
  Author URI: https://antonplauche.com
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

class BetterCustomClassesForGutenberg
{

  /**
   * Constructor function 
   *  - adds asset info from build directory 
   *  - hooks into block editor asset enqueue
   */
  function __construct()
  {
    $this->assetInfo = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');
    $this->adminAssetInfo = include(plugin_dir_path(__FILE__) . 'build/admin.asset.php');

    // Enqueue Scripts for editor and admin
    add_action('admin_enqueue_scripts', array($this, 'adminAssets'));
    add_action('enqueue_block_editor_assets', array($this, 'editorAssets'));

    // Register the class library menu page
    add_action('admin_menu', array($this, 'menu_page'));

    // Activation script to register option
    add_action('activate_plugin', array($this, 'on_activate'));

    // Add our setting to the REST API
    add_action('admin_init', array($this, 'add_settings'));
    add_action('rest_api_init', array($this, 'add_settings'));

  }

  // Utility for sanitizing an array of class attributes
  function sanitize_array_of_classes(array $array)
  {
    return array_map('sanitize_html_class', $array);
  }

  /**
   * Enqueue JS for admin page class library 
   */
  function adminAssets($hook)
  {

    //var_dump($hook);
    // Load only on /tools.php?page=bccfg-class-library-settings.
    if ( 'tools_page_bccfg-class-library-settings' !== $hook ) {
        return;
    }

    wp_enqueue_script('custom-class-library-script', plugin_dir_url(__FILE__) . 'build/admin.js', $this->adminAssetInfo['dependencies'], $this->adminAssetInfo['version'], true);
    wp_enqueue_style('custom-class-library-styles', plugin_dir_url(__FILE__) . 'build/admin.css', array(), $this->adminAssetInfo['version']);
  }

  /**
   * Enqueue JS for editor 
   * Enqueue custom styles within block editor for added settings pane
   */
  function editorAssets($hook)
  {
    wp_enqueue_script('custom-class-filters', plugin_dir_url(__FILE__) . 'build/index.js', $this->assetInfo['dependencies'], $this->assetInfo['version']);
    wp_enqueue_style('custom-class-styles', plugin_dir_url(__FILE__) . 'build/index.css', array(), $this->assetInfo['version']);
  }

  function on_activate()
  {
    // OPTIONS SETUP
    // first check if options are already there
    $options = get_option('bccfg_class_library');

    // on first activation will return false
    if (!$options) {
      add_option('bccfg_class_library', array());
    } else if (!is_array($options)) {
      delete_option('bccfg_class_library');
      add_option('bccfg_class_library', array());
    }
  }

  function menu_page()
  {
    add_submenu_page(
      'tools.php',
      'Class Library',
      'Class Library',
      'manage_options',
      'bccfg-class-library-settings',
      array($this, 'render_menu_page')
    );
  }

  function render_menu_page(){
    ?>
    <div class="wrap">
      <h1 style="margin-bottom: 16px;">Class Library</h1>
      <div class="bccfg-intro">
        <h2>Manage your class library</h2>
        <p>Classes added here will populate your auto-complete field globally within the block editor.</p>
      </div>
      <div id="bccfg-library-app"></div>
    </div>
    <?php
  }

  function add_settings()
  {
    /**
     * Registers a setting for Wordpress 4.7 and higher.
     **/
    $args = array(
      'type' => 'array',
      'sanitize_callback' => [$this, 'sanitize_array_of_classes'],
      'show_in_rest' => array(
        'schema' => array(
          'type'  => 'array',
          'items' => array(
            'type' => 'string',
          ),
        ),
      )
    );
    register_setting('bccfg-class-library-settings', 'bccfg_class_library', $args);
  }
}

// Entry Point
new BetterCustomClassesForGutenberg();
