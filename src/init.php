<?php
defined( 'ABSPATH' ) || exit;

function get_forms_cpt_data() {
	$posts = get_posts(
		array(
			'post_type'   => 'cwp_gf_forms',
			'post_status' => 'publish',
			'numberposts' => - 1,
			'orderby'     => 'post_title',
			'order'       => 'ASC',
		)
	);

	$result = array();
	foreach ( $posts as $post ) {
		$result[] = array(
			'url'           => get_post_permalink( $post->ID ),
			'ID'            => $post->ID,
			'post_title'    => $post->post_title,
			'post_edit_url' => get_edit_post_link( $post->ID ),
		);
	}

	return $result;
}

function gutenberg_forms_cwp_block_assets(): void {
	require_once plugin_dir_path( __DIR__ ) . 'admin/admin.php';

	$dashboard = new Dashboard();
	$dashboard->register_settings();

	wp_register_style(
		'gutenberg_forms-cwp-style-css',
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
		is_admin() ? array( 'wp-editor' ) : null,
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' )
	);

	wp_register_script(
		'gutenberg_forms-cwp-block-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ),
		false
	);

	wp_register_script(
		'gutenberg-forms-custom-js',
		plugins_url( '/dist/frontend.js', dirname( __FILE__ ) ),
		array( 'jquery' ),
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/frontend.js' ),
		true
	);

	wp_register_style(
		'gutenberg_forms-cwp-block-editor-css',
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ),
		'all'
	);

	wp_localize_script(
		'gutenberg_forms-cwp-block-js',
		'cwpGlobal',
		array(
			'pluginDirPath'   => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'    => plugin_dir_url( __DIR__ ),
			'site_url'        => get_bloginfo( 'url' ),
			'cwp-cpt-forms'   => get_forms_cpt_data(),
			'primary-color'   => get_user_option( 'admin_color' ),
			'new_form_url'    => admin_url( 'post-new.php?post_type=cwp_gf_forms' ),
			'admin_email'     => get_bloginfo( 'admin_email' ),
			'settings'        => $dashboard->settings,
			'generalSettings' => json_decode( get_option( 'cwp_gutenberg_forms_general_settings' ), JSON_PRETTY_PRINT ),
		)
	);

	$files = array(
		'style'           => 'gutenberg_forms-cwp-style-css',
		'editor_script'   => 'gutenberg_forms-cwp-block-js',
		'editor_style'    => 'gutenberg_forms-cwp-block-editor-css',
		'assets_callback' => function ( $attributes ) {
			var_dump( $attributes );
		},
	);

	if ( ! is_admin() ) {
		$files['script'] = 'gutenberg-forms-custom-js';
	}

	register_block_type( 'cwp/block-gutenberg-forms', $files );
}

//! Our custom post type function
function cwp_form_post_type(): void {
	require_once plugin_dir_path( __DIR__ ) . 'admin/cpt/entry.php';
	require_once plugin_dir_path( __DIR__ ) . 'admin/cpt/form.php';
	require_once plugin_dir_path( __DIR__ ) . 'controllers/index.php';

	Form::register_post_type();
	Entries::register_post_type();
}

require_once plugin_dir_path( __DIR__ ) . 'triggers/email.php';

add_action(
	'wp_head',
	function () {
		require_once plugin_dir_path( __DIR__ ) . 'assets/index.assets.php';

		global $post;

		if ( ! empty( $post ) ) {
			$post = get_post( $post->ID );

			$parsed_blocks = parse_blocks( do_shortcode( $post->post_content ) );

			if ( ! empty( $parsed_blocks ) ) {
				$assets_holder = new cwp_gf_AssetsHandler( $parsed_blocks ); # for enqueuing conditional block assets
				$assets_holder->enqueue();
			}
		}
	}
);

function submitter() {
	global $post;

	if ( ! empty( $post ) ) {
		$post          = get_post( $post->ID );
		$parsed_blocks = parse_blocks( do_shortcode( $post->post_content ) );

		if ( ! empty( $parsed_blocks ) ) {
			$email_apply = new Email( $parsed_blocks );

			$email_apply->init();
		}
	}
}

function cwp_gutenberg_forms_messages_meta() {
	register_post_meta( 'post', 'myguten_meta_block_field', array(
		'show_in_rest' => true,
		'single'       => true,
		'type'         => 'string',
	) );
}

add_action(
	'init',
	function (): void {
		wp_set_script_translations( 'gutenberg_forms-cwp-block-js', 'forms-gutenberg' );
	}
);

add_action( 'init', 'cwp_gutenberg_forms_messages_meta' );
add_action( 'wp_head', 'submitter' );
add_action( 'wp-load', 'submitter' );
add_action( 'init', 'cwp_form_post_type' );
add_action( 'init', 'gutenberg_forms_cwp_block_assets' );

add_filter(
	'plugin_row_meta',
	function( array $plugin_meta, string $plugin_file ): array {
		if ( 'gutenberg-forms/gutenberg-forms.php' === $plugin_file ) {
			$plugin_meta['settings'] = sprintf(
				'<a href="%s">%s</a>',
				esc_url( admin_url( 'admin.php?page=gutenberg_forms' ) ),
				__( 'Dashboard', 'forms-gutenberg' ),
			);
		}

		return $plugin_meta;
	},
	10,
	2
);
