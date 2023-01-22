<?php
namespace GutenbergForms\Core\Blocks\Traits;

defined( 'ABSPATH' ) || exit;

/**
 * Has styles trait.
 *
 * @since 2.9.9.1
 */
trait HasStyles {
	/**
	 * Maps style attribute.
	 *
	 * @since 2.9.9.1
	 *
	 * @param array $styles Styles.
	 *
	 * @return string
	 */
	protected function map_style_attribute( array $styles ): string {
		$style = '';

		foreach ( $styles as $key => $value ) {
			$style .= $key . ':' . $value . ';';
		}

		return $style;
	}
}
