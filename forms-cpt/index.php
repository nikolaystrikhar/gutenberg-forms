<?php 


require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';
require_once plugin_dir_path( __DIR__ ) . 'forms-cpt/reusable.php';


class Form {


    const text_domain = "cwp-gutenberg-forms";
    const post_type = "cwp_gf_forms";

    public static function register_post_type() {

        $post_type_labels = generate_post_type_labels( 'Forms', 'Form', 'Forms', self::text_domain );

        register_post_type(
            self::post_type,
            array(
                'labels' => $post_type_labels,
                'description'        => __( 'For storing forms', self::text_domain ),
                'show_in_menu'       => false,
                'menu_icon' => 'dashicons-feedback',
                'public' => true,
                'show_in_rest' => true,
                'supports' => array('editor', 'title'),
                'template' => array(
                    array('cwp/block-gutenberg-forms' , array(
                        'cpt' => true
                    ))
                ),
                'template_lock' => 'all'
            )
        ); 

        // registering short_code for reusable gutenberg form block through short_code
        register_form_shortcode( self::post_type );

        //? set_custom_form_columns -> functions.php
        add_filter( 'manage_'. self::post_type .'_posts_columns', 'manage_form_columns_headers', 100 );
        add_filter( 'manage_'. self::post_type .'_posts_custom_column', 'get_custom_form_columns', 100 , 2 );

    }

}
