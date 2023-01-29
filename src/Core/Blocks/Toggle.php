<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * yesNo block.
 *
 * @since 2.9.9.1
 */
class Toggle extends FieldBlock {
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
			class="cwp-yes-no cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<label class="cwp-switch">
					<input
						name="<?php echo esc_attr( $attributes['id'] ); ?>"
						id="<?php echo esc_attr( $attributes['id'] ); ?>"
						type="hidden"
						value="<?php echo esc_attr( $attributes['yes_no'] ? 'yes' : 'no' ); ?>"
						readOnly
					/>

					<input
						name="<?php echo esc_attr( $attributes['id'] ); ?>"
						id="<?php echo esc_attr( $attributes['id'] ); ?>"
						type="checkbox"
						<?php if ( $attributes['isRequired'] ): ?>
							required
						<?php endif; ?>
						data-cwp-field
						<?php echo checked( $attributes['yes_no'] ); ?>"
					/>

					<span class="cwp-slider"></span>
				</label>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
