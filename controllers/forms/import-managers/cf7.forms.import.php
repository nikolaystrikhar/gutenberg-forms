<?php
defined( 'ABSPATH' ) || exit;

/**
 * Contact form 7 forms import manager in the gutenberg forms
 */
class cwp_gf_cf7_import_manager {
	const post_type = "wpcf7_contact_form"; # contact form 7 post type

	/**
	 * Will import all the available forms in the contact form 7 cpt
	 * into gutenberg forms
	 */

	public function import_all() {
		return;
	}

	/**
	 * Will import the selective forms iterating through given list of post ids
	 * and converting them into gutenberg forms post in custom post type
	 *
	 * @param int[] $ids
	 */

	public function import_selective( $ids ) {
		# some safety checks
		if ( ! is_array( $ids ) ) {
			return false;
		}

		$query_arguments = [
			'post_type' => self::post_type,
			'post__in'  => $ids,
		];
		$query           = new WP_Query( $query_arguments );

		# cf7 posts has small shortcode tags of fields
		# therefore adding parsed shortcode post content in all posts
		# fetched by the above query

		foreach ( $query->posts as $post ) :

			# preparing the contact form 7 shortcode for current post
			$form_shortcode = "[contact-form-7 id='{$post->ID}' title='$post->post_title']";

			# then adding the parsed content using the above shortcode
			$post->post_parsed_content = do_shortcode( $form_shortcode );

		endforeach;

		foreach ( $query->posts as $post ) :

			/**
			 * PHP can read DOM from string with the DOMDocument::loadHTML
			 *
			 * @since php version 5 - current version
			 * @see   https://www.php.net/manual/en/domdocument.loadhtml.php
			 */

			$document = new DOMDocument();
			# loading contact form 7 parsed form html to read
			$document->loadHTML(
				'<html><body>' . $post->post_parsed_content . '</body></html>'
			);

			# finding all form elements
			$inputs  = $document->getElementsbytagname( 'input' );
			$selects = $document->getElementsbytagname( 'select' );

			// TODO combine all available form tags above
			$elements = $inputs;

			$formatted_options = [];
			# this template will be used to convert contact form 7 -> gutenberg forms blocks
			$gutenberg_forms_post_template = [];

			foreach ( $elements as $element ) :

				$data = [];

				# some use-full form element attributes
				$type                   = $element->getAttribute( 'type' );
				$class                  = $element->getAttribute( 'class' );
				$name                   = $element->getAttribute( 'name' );
				$requiredAttribute      = $element->getAttribute( 'required' );
				$required               = empty( $requiredAttribute ) ? false : $requiredAttribute;
				$is_multi_options_field = in_array( $type, [ 'select', 'radio', 'checkbox' ] );

				# checking if the current input is contact form 7 hidden field
				# which carries hidden information which will be excluded
				$is_cf7_hidden_field = $type === 'hidden' && substr( $name, 0, strlen( '_wpcf7' ) ) == '_wpcf7';

				# skipping current iteration if it's a cf7 hidden field
				if ( $is_cf7_hidden_field ) {
					continue;
				}

				$data['type']     = $type;
				$data['class']    = $class;
				$data['name']     = $name;
				$data['required'] = $required;

				if ( $is_multi_options_field ) {
					$data['options'] = $this->get_options( $element );
				}

				$formatted_options[] = $data;

			endforeach;

			$post->formatted_elements = $formatted_options;

		endforeach;

		return $query->posts;
	}

	/**
	 * Will parse options of the multi options fields
	 *
	 * @param DOMNode $field
	 *
	 * @return string[] $field_options
	 * @example radio, checkbox, select
	 */

	public function get_options( $field ) {
		return [];
	}
}
