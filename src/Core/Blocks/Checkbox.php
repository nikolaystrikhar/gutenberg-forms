<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Checkbox block.
 *
 * @since 2.9.9.1
 */
class Checkbox extends FieldBlock {
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
		// Fix for versions pre 2.2.9.1.
		if ( '[]' === mb_substr( $attributes['id'], -2 ) ) {
			$attributes['id'] = mb_substr( $attributes['id'], 0, -2 );
		}

		ob_start();
		?>
		<div
			class="cwp-checkbox cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div
				data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
				class="cwp-checkbox-set <?php echo esc_attr( $attributes['isRequired'] ? 'required-checkbox' : '' ); ?>"
			>
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<?php foreach ( $attributes['options'] as $index => $option ): ?>
					<div class="cwp-checkbox-option">
						<input
							name="<?php echo esc_attr( $attributes['id'] ); ?>[]"
							id="<?php echo esc_attr( $attributes['id'] . '_' . $index ); ?>"
							type="checkbox"
							<?php if ( $attributes['isRequired'] ): ?>
								required
							<?php endif; ?>
							data-rule="false"
							data-cwp-field
							data-required="false"
							value="<?php echo esc_attr( $option['label'] ); ?>"
							<?php echo checked( $option['checked'] ); ?>
						>

						<label for="<?php echo esc_attr( $attributes['id'] . '_' . $index ); ?>">
							<?php echo esc_html( $option['label'] ); ?>

							<?php if ( ! empty( $option['image'] ) ): ?>
								<div class="cwp-checkbox-image">
									<img
										style="height: <?php echo esc_attr( $option['image']['height'] ); ?>; width: <?php echo esc_attr( $option['image']['width'] ); ?>;"
										src="<?php echo esc_url( $option['image']['url'] ); ?>"
									/>
								</div>
							<?php endif; ?>
						</label>
					</div>
				<?php endforeach; ?>

				<?php echo $this->map_hint( $attributes['showHint'], $attributes['hint'] ); ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
