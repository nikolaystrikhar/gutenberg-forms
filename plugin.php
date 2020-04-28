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

if ( ! function_exists( 'cwp_gf_fs' ) ) {
    // Create a helper function for easy SDK access.
    function cwp_gf_fs() {
        global $cwp_gf_fs;

        if ( ! isset( $cwp_gf_fs ) ) {
            // Include Freemius SDK.
            require_once dirname(__FILE__) . '/freemius/start.php';

            $cwp_gf_fs = fs_dynamic_init( array(
                'id'                  => '5958',
                'slug'                => 'forms-gutenberg',
                'type'                => 'plugin',
                'public_key'          => 'pk_e4b04fdf3f1b35034e9031212ef90',
                'is_premium'          => false,
                'has_addons'          => true,
                'has_paid_plans'      => false,
                'menu'                => array(
                    'slug'           => 'gutenberg_forms',
                    'contact'        => false,
                    'support'        => false,
                ),
            ) );
        }

        return $cwp_gf_fs;
    }

    // Init Freemius.
    cwp_gf_fs();
    // Signal that SDK was initiated.
    do_action( 'cwp_gf_fs_loaded' );
}



if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'src/init.php';