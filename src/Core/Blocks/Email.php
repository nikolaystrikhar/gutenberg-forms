<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Email block.
 *
 * @since 2.9.9.1
 */
class Email extends FieldBlock {
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
			class="cwp-email cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<div class="cwp-field-with-elements">
					<?php echo $this->map_prefix( $attributes['prefix']['enable'], $attributes['prefix']['content'], $attributes['prefix']['position'] ); ?>

					<input
						name="<?php echo esc_attr( $attributes['id'] ); ?>"
						id="<?php echo esc_attr( $attributes['id'] ); ?>"
						type="email"
						<?php if ( $attributes['isRequired'] ): ?>
							required
						<?php endif; ?>
						placeholder="<?php echo esc_attr( $attributes['email'] ); ?>"
						title=""
						data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
						data-rule="false"
						data-cwp-field
						data-validation="email"
					/>

					<?php echo $this->map_suffix( $attributes['suffix']['enable'], $attributes['suffix']['content'], $attributes['suffix']['position'] ); ?>
				</div>
			</div>

			<?php echo $this->map_hint( $attributes['showHint'], $attributes['hint'] ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
