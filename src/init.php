<?php

if (!defined('ABSPATH')) {
	exit;
}

function gutenberg_forms_cwp_block_assets()
{
	wp_register_style(
		'gutenberg_forms-cwp-style-css',
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)),
		is_admin() ? array('wp-editor') : null,
		null
	);

	wp_register_script(
		'gutenberg_forms-cwp-block-js',
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)),
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'),
		null,
		true
	);

	wp_register_script(
		'gutenberg-forms-custom-js',
		plugins_url('/dist/custom_frontend.js', dirname(__FILE__)),
		array('jquery'),
		null,
		true
	);



	wp_register_style(
		'gutenberg_forms-cwp-block-editor-css',
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)),
		array('wp-edit-blocks'),
		null
	);

	wp_localize_script(
		'gutenberg_forms-cwp-block-js',
		'cwpGlobal',
		[
			'pluginDirPath' => plugin_dir_path(__DIR__),
			'pluginDirUrl'  => plugin_dir_url(__DIR__),
		]
	);


	register_block_type(
		'cwp/block-gutenberg-forms',
		array(
			'style'         => 'gutenberg_forms-cwp-style-css',
			'editor_script' => 'gutenberg_forms-cwp-block-js',
			'script'		=> 'gutenberg-forms-custom-js',
			'editor_style'  => 'gutenberg_forms-cwp-block-editor-css',
		)
	);
}


// Our custom post type function
// function create_posttype() {

// 	register_post_type(
// 		'forms',
// 		// CPT Options
// 		array(
// 			'labels' => array(
// 				'name' => __('Forms'),
// 				'singular_name' => __('Form')
// 			),
// 			'icon' => 'email-alt',
// 			'supports' => array('editor', 'title'),
// 			'show_in_rest' => true,
// 			'template' => array(
// 				array( 'cwp/block-gutenberg-forms', array() )
// 			),
// 			'template_lock' => 'all',
// 			'public' => true,
// 			'has_archive' => true,
// 			'rewrite' => array('slug' => 'forms'),
// 		)
// 	);
// }


require_once plugin_dir_path( __DIR__ ) . 'triggers/email.php';


function submitter() {

	global $post;

	$content = get_post($post->ID)->post_content;
	$parsed_blocks = parse_blocks($content);

	if (!empty($parsed_blocks)) {
		$email_apply = new Email($parsed_blocks);

		$email_apply->init();
	}

}

function my_admin_page_contents() {
	return "<h1>Hola World</h1>";
}


// require_once plugin_dir_path( __DIR__ ) . 'admin/admin.php';

// function my_sub_menu() {

// 	add_submenu_page(
// 		"edit.php?post_type=forms",
// 		__( 'Form Settings', 'my-textdomain' ),
// 		__( 'Form Settings', 'my-textdomain' ),
// 		'manage_options',
// 		'cwp-forms-settings',
// 		'Settings'
// 	);

// }


// add_action( 'admin_menu', 'my_sub_menu' );


function cwp_gutenberg_forms_messages_meta() {
    register_post_meta( 'post', 'myguten_meta_block_field', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ) );
}

function cwpgutenbergforms_set_script_translations() {
	wp_set_script_translations( 'gutenberg_forms-cwp-block-js', 'cwp-gutenberg-forms' );
}


add_action( 'init', 'cwpgutenbergforms_set_script_translations' );
add_action( 'init', 'cwp_gutenberg_forms_messages_meta' );
//custom_postype for our gutenberg-forms;
add_action('wp_head' , 'submitter');
add_action('wp-load' , 'submitter');
// add_action('init', 'create_posttype');
add_action('init', 'gutenberg_forms_cwp_block_assets');
