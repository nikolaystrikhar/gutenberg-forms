<?php

namespace GutenbergForms\Core;

use Exception;

/**
 * Gutenberg Forms Heart.
 *
 * @since 2.9.9.1
 */
class GutenbergForms {
	/**
	 * Initiates the plugin.
	 *
	 * @since 2.9.9.1
	 *
	 * @throws Exception If something went wrong during the plugin initialization.
	 *
	 * @return void
	 */
	public static function init(): void {
		BlockHandler::init();

		require_once GUTENBERG_FORMS_PATH . 'src/init.php';
	}
}
