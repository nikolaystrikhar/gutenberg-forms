<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';
require_once plugin_dir_path( __DIR__ ) . 'cpt/reusable.php';

class Form {
	const text_domain = "cwp-gutenberg-forms";

	const post_type = "cwp_gf_forms";

	public static function register_post_type() {
		register_post_type(
			self::post_type,
			array(
                'labels'             => array(
                    'name'                  => __( 'Forms', 'gutenberg-forms' ),
                    'singular_name'         => __( 'Form', 'gutenberg-forms' ),
                    'menu_name'             => __( 'Forms', 'gutenberg-forms' ),
                    'name_admin_bar'        => __( 'Forms', 'gutenberg-forms' ),
                    'archives'              => __( 'Forms Archives', 'gutenberg-forms' ),
                    'attributes'            => __( 'Forms Attributes', 'gutenberg-forms' ),
                    'parent_item_colon'     => __( 'Forms:', 'gutenberg-forms' ),
                    'all_items'             => __( 'All Forms', 'gutenberg-forms' ),
                    'add_new_item'          => __( 'Add New Form', 'gutenberg-forms' ),
                    'add_new'               => __( 'Add Form', 'gutenberg-forms' ),
                    'new_item'              => __( 'New Form', 'gutenberg-forms' ),
                    'edit_item'             => __( 'View Form', 'gutenberg-forms' ),
                    'update_item'           => __( 'Update Form', 'gutenberg-forms' ),
                    'view_item'             => __( 'View Form', 'gutenberg-forms' ),
                    'view_items'            => __( 'View Forms', 'gutenberg-forms' ),
                    'search_items'          => __( "Search Form", 'gutenberg-forms' ),
                    'not_found'             => __( 'Form Not found', 'gutenberg-forms' ),
                    'not_found_in_trash'    => __( 'Form Not found in Trash', 'gutenberg-forms' ),
                    'featured_image'        => __( 'Featured Image', 'gutenberg-forms' ),
                    'set_featured_image'    => __( 'Set featured image', 'gutenberg-forms' ),
                    'remove_featured_image' => __( 'Remove featured image', 'gutenberg-forms' ),
                    'use_featured_image'    => __( 'Use as featured image', 'gutenberg-forms' ),
                    'insert_into_item'      => __( 'Insert into form', 'gutenberg-forms' ),
                    'uploaded_to_this_item' => __( 'Uploaded to this form', 'gutenberg-forms' ),
                    'items_list'            => __( 'Forms list', 'gutenberg-forms' ),
                    'items_list_navigation' => __( 'Forms list navigation', 'gutenberg-forms' ),
                    'filter_items_list'     => __( 'Filter forms list', 'gutenberg-forms' ),
                ),
				'description'   => __( 'For storing forms', self::text_domain ),
				'show_in_menu'  => false,
				'menu_icon'     => 'dashicons-feedback',
				'public'        => true,
				'show_in_rest'  => true,
				'supports'      => array( 'editor', 'title' ),
				'template'      => array(
					array(
						'cwp/block-gutenberg-forms',
						array(
							'cpt' => true,
						),
					),
				),
				'template_lock' => 'all',
			)
		);

		// registering short_code for reusable gutenberg form block through short_code
		register_form_shortcode( self::post_type );

		add_filter(
			'manage_' . self::post_type . '_posts_columns',
			function ( array $defaults ): array {
				$headers = array();

				$headers['title']     = $defaults['title'];
				$headers['shortcode'] = esc_html__( 'Shortcode', 'gutenberg-forms' );
				$headers['date']      = $defaults['date'];

				return $headers;
			},
			100
		);

		add_filter(
			'manage_' . self::post_type . '_posts_custom_column',
			function ( string $column_name, int $post_id ): void {
				if ( 'shortcode' === $column_name ) {
					echo sprintf( '[gutenberg_form id="%d"]', esc_attr( $post_id ) );
				}
			},
			100,
			2
		);
	}
}
