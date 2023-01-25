<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Existing form block.
 *
 * @since 2.9.9.1
 */
class ExistingForm extends Block {
	/**
	 * Renders a block.
	 *
	 * @since 2.9.9.1
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	public function render( array $attributes ): string {
		$form_id = absint( $attributes['formId'] ?? 0 );

		if ( 0 === $form_id ) {
			return '';
		}

		return do_shortcode( '[gutenberg_form id="' . $form_id . '"]' );
	}
}
