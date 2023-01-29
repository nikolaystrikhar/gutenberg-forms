<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Textarea block.
 *
 * @since 2.9.9.1
 */
class Textarea extends FieldBlock {
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
			class="cwp-message cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<textarea
					name="<?php echo esc_attr( $attributes['id'] ); ?>"
					id="<?php echo esc_attr( $attributes['id'] ); ?>"
					<?php if ( $attributes['isRequired'] ): ?>
						required
					<?php endif; ?>
					placeholder="<?php echo esc_attr( $attributes['message'] ); ?>"
					title=""
					data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
					data-rule="false"
					data-cwp-field
					style="height: <?php echo esc_attr( $attributes['height'] ); ?>px;"
					minlength="<?php echo esc_attr( $attributes['minimumLength'] ); ?>"
					maxlength="<?php echo esc_attr( $attributes['maximumLength'] ); ?>"
				></textarea>
			</div>

			<?php echo $this->map_hint( $attributes['showHint'], $attributes['hint'] ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
