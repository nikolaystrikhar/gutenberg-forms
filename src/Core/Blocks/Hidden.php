<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Hidden block.
 *
 * @since 2.9.9.1
 */
class Hidden extends FieldBlock {
	private const NAME = 'cwp/hidden';

	/**
	 * Returns a block name.
	 *
	 * @since 2.9.9.1
	 *
	 * @return string
	 */
	public static function get_name(): string {
		return self::NAME;
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
	public function render( array $attributes ): string {
		// Attributes that always exist.

		$id = $attributes['id'];

		// Custom attributes.

		$value = $attributes['value'] ?? '';

		ob_start();
		?>
		<div class="cwp-hidden cwp-field">
			<input
				name="<?php echo esc_attr( $id ); ?>"
				id="<?php echo esc_attr( $id ); ?>"
				type="hidden"
				value="<?php echo esc_attr( $value ); ?>"
			/>
		</div>
		<?php
		return ob_get_clean();
	}
}
