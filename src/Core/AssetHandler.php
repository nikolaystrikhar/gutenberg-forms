<?php
namespace GutenbergForms\Core;

use GutenbergForms\Core\Blocks\ExistingForm;

defined( 'ABSPATH' ) || exit;

/**
 * Includes assets.
 *
 * @since 2.9.9.1
 */
class AssetHandler {
	/**
	 * Includes assets.
	 *
	 * @since 2.9.9.1
	 *
	 * @return void
	 */
	public static function init(): void {
		add_action(
			'wp_enqueue_scripts',
			function(): void {
				if (
					! has_block( 'cwp/block-gutenberg-forms' )
					&& ! has_block( 'cwp/reusable-form' )
				) {
					return;
				}

				// TODO: Include it for forms with google recaptcha only.
				wp_enqueue_script(
					'google-recaptcha',
					"https://www.google.com/recaptcha/api.js?hl=" . Helper::get_language_code(),
					array(),
					false,
					true
				);
			}
		);
	}
}
