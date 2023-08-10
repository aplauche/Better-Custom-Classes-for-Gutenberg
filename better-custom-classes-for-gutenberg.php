<?php
/**
 * @version 0.1.2
 */
/*
  Plugin Name: Better Custom Classes for Gutenberg
  Description: A better interface for applying custom classes to blocks in the gutenberg editor.
  Author: Anton Plauche
  Version: 0.1.2
  Author URI: https://antonplauche.com
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

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
    add_action('admin_menu', array($this, 'menu_page'));
    add_action( 'admin_post_nopriv_bccfg_class_library_form', array($this, 'handle_class_library_submit') );
    add_action( 'admin_post_bccfg_class_library_form', array($this, 'handle_class_library_submit') );
  }

  // Utility for sanitizing an array of class attributes
  function sanitize_array_of_classes( array $array ) {
    return array_map( 'sanitize_html_class', $array );
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
        add_option( 'bccfg_class_library', array());
      } else if (!is_array($options)) {
        delete_option( 'bccfg_class_library' );
        add_option( 'bccfg_class_library', array());
      }
  }

  function add_settings(){
    /**
    * Registers a text field setting for Wordpress 4.7 and higher.
    **/
    $args = array(
      'type' => 'array', 
      'sanitize_callback' => [$this, 'sanitize_array_of_classes'],
      'show_in_rest' => true
    );
    register_setting( 'bccfg-class-library-settings', 'bccfg_class_library', $args ); 


  }

  function menu_page() {
    add_submenu_page(
      'tools.php',
      'Class Library',
      'Class Library',
      'manage_options',
      'bccfg-class-library-settings',
      array($this, 'library_save_callback') );
  }


  function library_save_callback(){

        $classList = get_option('bccfg_class_library');

        if(!is_array($classList)){
          $classList = [];
        }

        ?>
        <div class="wrap"><div id="icon-tools" class="icon32"></div>
        <h2>Gutenberg Class Library</h2>
        <?php

          // Check if status is 1 which means a successful options save just happened
          if(isset($_GET['status']) && $_GET['status'] == 1): ?>
            
            <div class="notice notice-success inline">
              <p>Options Saved!</p>
            </div>

          <?php endif;

        ?>
        <form action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="POST">

            <h3>Your remembered classes:</h3>
            <p>You can enter a list of comma-seperated classes here to populate your autocomplete class library.</p>

            <!-- The nonce field is a security feature to avoid submissions from outside WP admin -->
            <?php wp_nonce_field( 'bccfg_options_verify', 'bccfg_update_library'); ?>

            <div>
              <textarea name="class-list" rows="8" cols="50"><?php echo $classList ? esc_html( trim( implode(',', $classList) ) ) : '' ; ?></textarea>
            </div>
            <input type="hidden" name="action" value="bccfg_class_library_form">			 
            <input type="submit" name="submit" id="submit" class="update-button button button-primary" value="Update Classes"  />
        </form> 
    </div>
  <?php }

  function handle_class_library_submit(){
        // Make sure user actually has the capability to edit the options
        if(!current_user_can( 'edit_theme_options' )){
          wp_die("You do not have permission to view this page.");
        }
      
        // pass in the nonce ID from our form's nonce field - if the nonce fails this will kill script
        if(check_admin_referer( 'bccfg_options_verify', 'bccfg_update_library')){
      
          if (isset($_POST['class-list'])) {

            preg_replace('/\W+/','',strtolower(strip_tags($item)));

              // trim and sanitize
              $classListString = trim(sanitize_text_field( $_POST['class-list'] ));

              // convert to an array of the classes
              $classList = explode(',', $classListString);

              // Map over array and validate that each is a valid class name attribute
              // Not really needed since we have sanitize callback, but doesn't hurt either
              $classList = $this->sanitize_array_of_classes($classList);
      
              // Add or update the option
              $option_exists = get_option('bccfg_class_library');
      
              if (!empty($classList) && !empty($option_exists)) {
                  update_option('bccfg_class_library', $classList);
              } else {
                  add_option('bccfg_class_library', $classList);
              }
          }
          wp_redirect($_SERVER['HTTP_REFERER'] . '&status=1');
        } else {
          wp_die("You do not have permission to view this page.");
        }
  }
}

// Entry Point
new BetterCustomClassesForGutenberg();