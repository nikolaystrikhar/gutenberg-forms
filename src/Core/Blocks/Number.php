<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Number block.
 *
 * @since 2.9.9.1
 */
class Number extends FieldBlock {
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
		// TODO: Support prefix and suffix.
		ob_start();
		?>
		<div
			class="cwp-number cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<div class="cwp-field-with-elements">
					<input
						name="<?php echo esc_attr( $attributes['id'] ); ?>"
						id="<?php echo esc_attr( $attributes['id'] ); ?>"
						type="number"
						<?php if ( $attributes['isRequired'] ): ?>
							required
						<?php endif; ?>
						title=""
						data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
						data-rule="false"
						data-cwp-field
						placeholder="<?php echo esc_attr( $attributes['number'] ); ?>"
						step="<?php echo esc_attr( $attributes['steps'] ); ?>"
						min="<?php echo esc_attr( $attributes['rangeMin'] ); ?>"
						max="<?php echo esc_attr( $attributes['rangeMax'] ); ?>"
					/>
				</div>
			</div>

			<?php echo $this->map_hint( $attributes['showHint'], $attributes['hint'] ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
