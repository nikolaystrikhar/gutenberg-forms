<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Block.
 *
 * @since 2.9.9.1
 */
abstract class Block {
	public static function init(): void {
		$block = new static();

		/**
		 * @since 2.9.9.1
		 */
		add_action(
			'init',
			function() use ( $block ): void {
				register_block_type(
					static::get_name(),
					array(
						'editor_script' => 'gutenberg-forms-blocks',
						'render_callback' => array( $block, 'render' )
					)
				);
			}
		);
	}

	/**
	 * Returns a block name.
	 *
	 * @since 2.9.9.1
	 *
	 * @return void
	 */
	abstract public static function get_name(): string;

	/**
	 * Renders a block.
	 *
	 * @since 2.9.9.1
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string
	 */
	abstract public function render( array $attributes ): string;
}
