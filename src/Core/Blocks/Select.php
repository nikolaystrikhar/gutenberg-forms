<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Select block.
 *
 * @since 2.9.9.1
 */
class Select extends FieldBlock {
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
		<div
			class="cwp-select cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set cwp-select-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<select
					name="<?php echo esc_attr( $attributes['id'] ); ?>"
					id="<?php echo esc_attr( $attributes['id'] ); ?>"
					<?php if ( $attributes['isRequired'] ): ?>
						required
					<?php endif; ?>
					data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
					data-rule="false"
					data-cwp-field
				>
					<?php foreach ( $attributes['options'] as $option ) : ?>
						<option value="<?php echo esc_attr( $option['label'] ); ?>">
							<?php echo esc_html( $option['label'] ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<?php echo $this->map_hint( $attributes['showHint'], $attributes['hint'] ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
