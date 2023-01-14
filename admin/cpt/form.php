<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __DIR__ ) . 'cpt/reusable.php';

class Form {
    private const post_type = "cwp_gf_forms";

	public static function register_post_type() {
		register_post_type(
			self::post_type,
			array(
				'labels'             => array(
					'name'                  => __( 'Forms', 'forms-gutenberg' ),
					'singular_name'         => __( 'Form', 'forms-gutenberg' ),
					'menu_name'             => __( 'Forms', 'forms-gutenberg' ),
					'name_admin_bar'        => __( 'Forms', 'forms-gutenberg' ),
					'archives'              => __( 'Forms Archives', 'forms-gutenberg' ),
					'attributes'            => __( 'Forms Attributes', 'forms-gutenberg' ),
					'parent_item_colon'     => __( 'Forms:', 'forms-gutenberg' ),
					'all_items'             => __( 'All Forms', 'forms-gutenberg' ),
					'add_new_item'          => __( 'Add New Form', 'forms-gutenberg' ),
					'add_new'               => __( 'Add Form', 'forms-gutenberg' ),
					'new_item'              => __( 'New Form', 'forms-gutenberg' ),
					'edit_item'             => __( 'View Form', 'forms-gutenberg' ),
					'update_item'           => __( 'Update Form', 'forms-gutenberg' ),
					'view_item'             => __( 'View Form', 'forms-gutenberg' ),
					'view_items'            => __( 'View Forms', 'forms-gutenberg' ),
					'search_items'          => __( "Search Form", 'forms-gutenberg' ),
					'not_found'             => __( 'Form Not found', 'forms-gutenberg' ),
					'not_found_in_trash'    => __( 'Form Not found in Trash', 'forms-gutenberg' ),
					'featured_image'        => __( 'Featured Image', 'forms-gutenberg' ),
					'set_featured_image'    => __( 'Set featured image', 'forms-gutenberg' ),
					'remove_featured_image' => __( 'Remove featured image', 'forms-gutenberg' ),
					'use_featured_image'    => __( 'Use as featured image', 'forms-gutenberg' ),
					'insert_into_item'      => __( 'Insert into form', 'forms-gutenberg' ),
					'uploaded_to_this_item' => __( 'Uploaded to this form', 'forms-gutenberg' ),
					'items_list'            => __( 'Forms list', 'forms-gutenberg' ),
					'items_list_navigation' => __( 'Forms list navigation', 'forms-gutenberg' ),
					'filter_items_list'     => __( 'Filter forms list', 'forms-gutenberg' ),
				),
				'description'        => __( 'For storing forms', 'forms-gutenberg' ),
				'show_in_menu'       => false,
				'menu_icon'          => 'dashicons-feedback',
				'public'             => true,
				'publicly_queryable' => false,
				'show_in_rest'       => true,
				'supports'           => array( 'editor', 'title' ),
				'template'           => array(
					array(
						'cwp/block-gutenberg-forms',
						array(
							'cpt' => true,
						),
					),
				),
				'template_lock'      => 'all',
			)
		);

		// registering short_code for reusable gutenberg form block through short_code
		register_form_shortcode( self::post_type );

		add_filter(
			'manage_' . self::post_type . '_posts_columns',
			function ( array $defaults ): array {
				$headers = array();

				$headers['title']     = $defaults['title'];
				$headers['shortcode'] = esc_html__( 'Shortcode', 'forms-gutenberg' );
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
