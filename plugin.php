<?php
/**
 * Plugin Name: Gutenberg Forms
 * Plugin URI: https://www.gutenbergforms.com
 * Description: The Next Generation WordPress Form Builder. Build forms directly within Gutenberg editor live. Add & arrange form fields like blocks.
 * Author: munirkamal
 * Author URI: https://cakewp.com/
 * Version: 1.2.0
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: cwp-gutenberg-forms
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_enqueue_scripts', function () {
	wp_enqueue_style( 'cwp_gf_admin_css', plugin_dir_url( __FILE__ ) . '/admin/admin.css', false, '1.0.0' );
});

require_once plugin_dir_path( __FILE__ ) . 'src/init.php';