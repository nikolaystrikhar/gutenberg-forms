<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Hidden block.
 *
 * @since 2.9.9.1
 */
class Hidden extends FieldBlock {
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
		ob_start();
		?>
		<div class="cwp-hidden cwp-field">
			<input
				name="<?php echo esc_attr( $attributes['id'] ); ?>"
				id="<?php echo esc_attr( $attributes['id'] ); ?>"
				type="hidden"
				value="<?php echo esc_attr( $attributes['value'] ); ?>"
			/>
		</div>
		<?php
		return ob_get_clean();
	}
}
