<?php

namespace GutenbergForms\Core;

/**
 * Contains helper functions.
 *
 * @since 2.9.9.1
 */
class Helper {
	/**
	 * Returns the language code.
	 *
	 * @since 2.9.9.1
	 *
	 * @return string
	 */
	public static function get_language_code(): string {
		return mb_substr(
			get_bloginfo( 'language' ),
			0,
			2
		);
	}
}
