<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Radio block.
 *
 * @since 2.9.9.1
 */
class Radio extends FieldBlock {
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

		// Stable attributes.

		$is_required      = $attributes['isRequired'] ?? false;
		$required_label   = $attributes['requiredLabel'] ?? '*';
		$label            = $attributes['label'] ?? '';
		$show_hint        = $attributes['showHint'] ?? false;
		$hint             = $attributes['hint'] ?? '';
		$error_messages   = $attributes['messages'] ?? '';
		$enable_condition = $attributes['enableCondition'] ?? false;
		$condition        = $enable_condition
			? $attributes['condition'] ?? ''
			: '';
		$field_style      = $attributes['className'] ?? 'is-style-default';

		// Custom attributes.

		$options = $attributes['options'] ?? array();

		ob_start();
		?>
		<div
			class="cwp-radio cwp-field <?php echo esc_attr( $field_style ); ?>"
			<?php if ( ! empty( $condition ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $condition ) ); ?>"
			<?php endif; ?>
		>
			<div
				data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
				class="cwp-radio-set <?php echo esc_attr( $is_required ? 'required-radio' : '' ); ?>"
			>
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<?php foreach ( $options as $index => $option ): ?>
					<div class="cwp-radio-option">
						<input
							name="<?php echo esc_attr( $id ); ?>"
							id="<?php echo esc_attr( $id . '_' . $index ); ?>"
							type="radio"
							<?php if ( $is_required ): ?>
								required
							<?php endif; ?>
							data-rule="false"
							data-cwp-field
							data-required="false"
							value="<?php echo esc_attr( $option['label'] ); ?>"
						>

						<label for="<?php echo esc_attr( $id . '_' . $index ); ?>">
							<?php echo esc_html( $option['label'] ); ?>

							<?php if ( ! empty( $option['image'] ) ): ?>
								<div class="cwp-radio-image">
									<img
										style="height: <?php echo esc_attr( $option['image']['height'] ); ?>; width: <?php echo esc_attr( $option['image']['width'] ); ?>;"
										src="<?php echo esc_url( $option['image']['url'] ); ?>"
									/>
								</div>
							<?php endif; ?>
						</label>
					</div>
				<?php endforeach; ?>

				<?php echo $this->map_hint( $show_hint, $hint ); ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
