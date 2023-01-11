<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __FILE__ ) . 'forms/forms.controller.php';

# registering all the rest controllers

$forms_controller = new cwp_gf_Forms_controller();

# for filtering with meta queries

add_action( 'rest_api_init', function () use ( $forms_controller ) {
	$forms_controller->register_routes();
} );

add_filter( 'rest_query_vars', function ( $vars ) {
	$extra_filters = array( 'post', 'post__in', 'type', 'id' );

	$vars[] = 'meta_query';

	return array_merge( $vars, $extra_filters );
} );
