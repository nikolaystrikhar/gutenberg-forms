<?php


require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';


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
			'site_url'		=> get_bloginfo('url'),
			'cwp-cpt-forms' => get_forms_cpt_data(),
			'primary-color'	=> get_user_option( 'admin_color' ),
			'new_form_url'	=> admin_url('post-new.php?post_type=cwp_gf_forms')
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


//! Our custom post type function
function cwp_form_post_type() {

	require_once plugin_dir_path( __DIR__ ) . 'submissions/entries.php';
	require_once plugin_dir_path( __DIR__ ) . 'forms-cpt/index.php';

	Form::register_post_type(); //? creating a post_type for forms
	Entries::register_post_type(); //? creating a post_type for our form entries

}


require_once plugin_dir_path(__DIR__) . 'triggers/email.php';

function submitter()
{

	global $post;

	if (!empty( $post )) {
		$post = get_post( $post->ID );

		$parsed_blocks = parse_blocks( do_shortcode($post->post_content) );

		if (!empty($parsed_blocks)) {

			$email_apply = new Email($parsed_blocks);

			$email_apply->init();
		}
	}
}

function cwp_gutenberg_forms_messages_meta()
{
	register_post_meta('post', 'myguten_meta_block_field', array(
		'show_in_rest' => true,
		'single' => true,
		'type' => 'string',
	));
}

function cwpgutenbergforms_set_script_translations()
{
	wp_set_script_translations('gutenberg_forms-cwp-block-js', 'cwp-gutenberg-forms');
}

//custom_postype for our gutenberg-forms;

require_once( plugin_dir_path( __DIR__ ) . '/admin/admin.php' );
add_action('init', 'cwpgutenbergforms_set_script_translations');
add_action('init', 'cwp_gutenberg_forms_messages_meta');
add_action('wp_head', 'submitter');
add_action('wp-load', 'submitter');
add_action('init', 'cwp_form_post_type');
add_action('add_meta_boxes', 'cwp_form_post_type');
add_action('init', 'gutenberg_forms_cwp_block_assets');
