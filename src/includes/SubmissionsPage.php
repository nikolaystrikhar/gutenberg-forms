<?php

// @todo DECIDE ON A NAMESPACE
namespace CWP\GutenbergForms;

class SubmissionsPage {

	private $page_title = 'Gutenberg Forms';
	private $menu_title = 'Gutenberg Forms';
	private $required_capability = 'manage_options';
	private $page_slug = 'gutenberg-forms-submissions';
	private $menu_icon = 'dashicons-forms';
	private $menu_position = 70;

	private $template_dir = __DIR__ . '/../templates/';

	public function __construct() {

	}

	/**
	 * WordPress Action Hooks & Filters
	 */
	public function init() {
		add_action('admin_menu', [ $this, 'add_menu_page' ]);
	}

	/**
	 * Add the menu page
	 */
	public function add_menu_page() {
		add_menu_page(
			$this->page_title,
			$this->menu_title,
			// @todo DECIDE ON A CAPABILITY
			$this->required_capability,
			$this->page_slug,
			[ $this, 'render' ],
			$this->menu_icon,
			$this->menu_position
		);
	}

	/**
	 * Build an array of forms
	 * Key: the original post's ID
	 * Value: Array with the number of submissions, the original post's title and URLs to edit and view the form
	 */
	private function get_forms() {

		/**
		 * Get all form submissions ordered by the ID of the original post
		 */
		$submissions = new \WP_Query( [
			'post_type'      => 'cwp_forms_submission',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'  		 => 'meta_value_num',
			'meta_key'		 => 'form_post_id',
			'order' => 'ASC',
		] );

		$forms = [];

		foreach ( $submissions->posts as $submission ) {

			// Retrieve the ID of the original post stored in a meta field
			$post_id = get_post_meta( $submission->ID )[ 'form_post_id' ][ 0 ];

			if ( ! isset( $forms[ $post_id ] ) ) {

				$forms[ $post_id ] = [
					'submissions'      => 1,
					'title'	           => get_the_title( $post_id ),
					'edit_form_url'    => get_edit_post_link( $post_id ),
					'view_form_url'    => get_permalink( $post_id ),
					'view_details_url' => add_query_arg( [
						'page'    => $this->page_slug,
						'post_id' => $post_id,
					], admin_url( 'admin.php' ) ),
				];

			} else {

				// Increment the submissions counter
				$forms[ $post_id ][ 'submissions' ] = $forms[ $post_id ][ 'submissions' ] + 1;

			}

		}

		return $forms;
	}

	/**
	 * Return an array of submissions for a specific form id (= the original post's id)
	 * @param $form_id integer The original post's ID
	 * @return array Array of submissions to a specific form
	 */
	private function get_submissions_by_form( $form_id ) {
		/**
		 * Get all form submissions for a specific form identified by its form id stored in post meta
		 */
		$query = new \WP_Query( [
			'post_type'      => 'cwp_forms_submission',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'  		 => 'meta_value_num',
			'meta_key'		 => 'form_post_id',
			'order' => 'ASC',
			'meta_query' => [
				[
					'key' => 'form_post_id',
					'value' => $form_id,
					'compare' => '=',
				],
			],
		] );

		$submissions = [];

		foreach( $query->posts as $submission ) {
			$submissions[] = [
				'id' 	    => $submission->ID,
				'post_date' => $submission->post_date,
				'fields'    => unserialize( $submission->post_content ),
			];
		}

		return $submissions;

	}

	/**
	 * Render the page
	 */
	public function render() {

		// @todo add capability check here as well

		if( isset( $_GET[ 'post_id' ] ) ) {
			// Render the details page for a specific form
			$this->render_details_page( $_GET[ 'post_id' ] );
			return;
		}

		// Render the overview page if no post_id is in the query string
		$this->render_overview_page();

	}

	/**
	 * Render the overview page
	 */
	public function render_overview_page() {
		$forms = $this->get_forms();
		require_once $this->template_dir . 'submissions-overview.php';
	}

	/**
	 * Render the details page for a specific form
	 */
	private function render_details_page( $form_id ) {
		$submissions = $this->get_submissions_by_form( $form_id );
		// Get the columns from the first entry
		$columns     = array_keys( $submissions[ 0 ][ 'fields' ] );
		require_once $this->template_dir . 'submissions-details.php';
	}

}
