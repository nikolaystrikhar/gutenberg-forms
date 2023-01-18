<?php

namespace GutenbergForms\Core;

use GutenbergForms\Core\Blocks\Textarea;

/**
 * Handles Gutenberg blocks.
 *
 * @since 2.9.9.1
 */
class BlockHandler {
	/**
	 * Initiates blocks.
	 *
	 * @since 2.9.9.1
	 *
	 * @return void
	 */
	public static function init(): void {
		Textarea::init();
	}
}
