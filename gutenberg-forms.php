<?php
/**
 * Plugin Name: Gutenberg Forms
 * Plugin URI: https://gutenbergforms.com
 * Description: The Next Generation WordPress Form Builder. Build forms directly within Gutenberg editor live. Add & arrange form fields like blocks.
 * Author: Nikolay Strikhar
 * Author URI: https://twitter.com/nikolaystrikhar
 * Version: 2.2.9
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: forms-gutenberg
 */

use GutenbergForms\Core\GutenbergForms;

defined( 'ABSPATH' ) || exit;

require __DIR__ . '/vendor/autoload.php';
require_once plugin_dir_path(__FILE__) . 'src/init.php';

add_action(
	'plugins_loaded',
	function(): void {
		define( 'GUTENBERG_FORMS_VERSION', '2.9.9.1' );

		define(
			'GUTENBERG_FORMS_PLUGIN_DIR',
			trailingslashit(
				str_replace( '\\', '/', WP_PLUGIN_DIR ) . '/' . basename( dirname( __FILE__ ) )
			)
		);

		define(
			'GUTENBERG_FORMS_PLUGIN_URL',
			str_replace(
				array( 'https://', 'http://' ),
				array( '//', '//' ),
				trailingslashit( WP_PLUGIN_URL . '/' . basename( dirname( __FILE__ ) ) )
			)
		);

		GutenbergForms::init();
	}
);
