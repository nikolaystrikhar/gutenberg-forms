<?php
namespace GutenbergForms\Core\Blocks;

use Exception;
use ReflectionClass;
use ReflectionException;

defined( 'ABSPATH' ) || exit;

/**
 * Block.
 *
 * @since 2.9.9.1
 */
abstract class Block {
	/**
	 * Initiates a block.
	 *
	 * @since 2.9.9.1
	 *
	 * @throws ReflectionException|Exception If the block class does not exist.
	 *
	 * @return void
	 */
	public static function init(): void {
		$block = new static();

		/**
		 * @since 2.9.9.1
		 */
		add_action(
			'init',
			function() use ( $block ): void {
				$block_name = ( new ReflectionClass( static::class ) )->getShortName();
				$block_name = array_filter( preg_split( '/(?=[A-Z])/', $block_name ) );
				$block_name = mb_strtolower( implode( '-', $block_name ) );

				$block_path = GUTENBERG_FORMS_PATH . 'src/blocks/' . $block_name;

				if ( ! is_dir( $block_path ) ) {
					throw new Exception( "Directory '$block_name' does not exist in blocks folder." );
				}

				register_block_type(
					$block_path,
					array(
						'editor_script' => 'gutenberg-forms-blocks',
						'render_callback' => array( $block, 'render' )
					)
				);
			}
		);
	}

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
