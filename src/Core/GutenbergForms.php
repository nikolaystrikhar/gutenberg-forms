<?php

namespace GutenbergForms\Core;

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
	 * @return void
	 */
	public static function init(): void {
		BlockHandler::init();
	}
}
