<?php
defined( 'ABSPATH' ) || exit;

function get_block( $id ) {
	$post = get_post( $id );

	return $post->post_status === 'publish' ? $post->post_content : '';
}

function short_code_callback( $atts ) {
	extract( shortcode_atts(
		array(
			'id' => '',
		),
		$atts
	) );

	$content = get_block( $id );

	return $content;
}

function register_form_shortcode( $post_type ) {
	// adding a custom short_code that reflects to the post_id;
	add_shortcode(
		'gutenberg_form',
		'short_code_callback'
	);
}
