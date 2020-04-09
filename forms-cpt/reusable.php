<?php 

// require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';

function get_block( $ID ) {

    $content_post = get_post( $ID );
    $content = $content_post->post_content;
    
    return $content;
}

function short_code_callback($atts) {


	extract(shortcode_atts(
		array(
            'id' => '',
	), $atts));

    // var_dump( get_post( $id )->post_title );
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