<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function gutenberg_forms_cgb_block_assets() { 
	wp_register_style(
		'gutenberg_forms-cgb-style-css', 
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), 
		array( 'wp-editor' ), 
		null 
	);

	wp_register_script(
		'gutenberg_forms-cgb-block-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), 
		null,
		true
	);

	wp_register_script(
		'gutenberg-forms-custom-js',
		plugins_url( '/dist/custom_frontend.js', dirname( __FILE__ ) ), 
		array('jquery'),
		null, 
		true 
	);

	wp_register_style(
		'gutenberg_forms-cgb-block-editor-css', 
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), 
		array( 'wp-edit-blocks' ), 
		null 
	);

	wp_localize_script(
		'gutenberg_forms-cgb-block-js',
		'cgbGlobal', 
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
		]
	);


	register_block_type(
		'cgb/block-gutenberg-forms', array(
			'style'         => 'gutenberg_forms-cgb-style-css',
			'editor_script' => 'gutenberg_forms-cgb-block-js',
			'script'		=> 'gutenberg-forms-custom-js',
			'editor_style'  => 'gutenberg_forms-cgb-block-editor-css',
		)
	);
}

add_action( 'init', 'gutenberg_forms_cgb_block_assets' );
