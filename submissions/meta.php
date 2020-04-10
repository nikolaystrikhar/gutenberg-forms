<?php 

require_once plugin_dir_path( __DIR__ ) . 'submissions/entry_boxes/fields.php';
require_once plugin_dir_path( __DIR__ ) . 'submissions/entry_boxes/extra_info.php';
require_once plugin_dir_path( __DIR__ ) . 'submissions/entry_boxes/template.php';
require_once plugin_dir_path( __DIR__ ) . 'submissions/entry_boxes/title.php';

class Meta {
    
    
    public static function register_meta_boxes( $post_type ) {

        // adding all the meta boxes required

        add_meta_box( "fields__$post_type", esc_html__( 'Fields', $post_type ), 'fields', $post_type, 'normal', 'high' );
        add_meta_box( "extra__$post_type", esc_html__( 'Additional Information', $post_type ), 'extra_info', $post_type, 'normal', 'high' );
        add_meta_box( "template__$post_type", esc_html__( 'Email Template', $post_type ), 'template', $post_type, 'normal', 'high' );
        add_meta_box( "title__$post_type", esc_html__( 'Title', $post_type ), 'title', $post_type, 'normal', 'high' );
        
    }


}