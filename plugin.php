<?php
/**
 * Plugin Name: Gutenberg Forms
 * Plugin URI: https://www.gutenbergforms.com
 * Description: The Next Generation WordPress Form Builder. Build forms directly within Gutenberg editor live. Add & arrange form fields like blocks.
 * Author: WPChill
 * Author URI: https://wpchill.com/
 * Version: 2.2.7
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: cwp-gutenberg-forms
 */


if (!defined('ABSPATH')) {
    exit;
}

if (is_readable(dirname(__FILE__) . '/extendify-sdk/loader.php')) {
    if (!isset($GLOBALS['extendify_sdk_partner'])) {
        // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
        $GLOBALS['extendify_sdk_partner'] = 'Partner Name';
    }
    require_once plugin_dir_path(__FILE__) . 'extendify-sdk/loader.php';
}


require_once plugin_dir_path(__FILE__) . 'src/init.php';
