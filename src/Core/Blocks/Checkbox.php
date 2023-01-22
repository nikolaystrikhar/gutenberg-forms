<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Checkbox block.
 *
 * @since 2.9.9.1
 */
class Checkbox extends FieldBlock {
	private const NAME = 'cwp/checkbox';

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

		// Custom attributes.

		$options     = $attributes['options'] ?? array();
		$field_style = $attributes['className'] ?? 'is-style-default';

		ob_start();
		?>
	<div
		class="cwp-checkbox cwp-field <?php echo esc_attr( $field_style ); ?>"
		data-condition="<?php echo esc_attr( ! empty( $condition ) ? wp_json_encode( $condition ) : '' ); ?>"
	>
		<div
			data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
			class="cwp-checkbox-set <?php echo esc_attr( $is_required ? 'required-checkbox' : '' ); ?>"
		>
			<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

			<?php foreach ( $options as $index => $option ): ?>
			<div class="cwp-checkbox-option">
				<input
					name="<?php echo esc_attr( $id ); ?>"
					id="<?php echo esc_attr( $id . '_' . $index ); ?>"
					type="radio"
					required="<?php echo esc_attr( $is_required ); ?>"
					data-rule="false"
					data-cwp-field
					data-required="false"
					value="<?php echo esc_attr( $option['label'] ); ?>"
					checked="<?php echo esc_attr( $option['checked'] ? 'checked' : '' ); ?>"
				>

				<label for="<?php echo esc_attr( $id . '_' . $index ); ?>">
					<?php echo esc_html( $option['label'] ); ?>

					<?php if ( $option['image'] ): ?>
						<div class="cwp-checkbox-image">
							<img
								style="height: <?php echo esc_attr( $option['image']['height'] ); ?>; width: <?php echo esc_attr( $option['image']['width'] ); ?>;"
								src="<?php echo esc_url( $option['image']['url'] ); ?>"
							/>
						</div>
					<?php endif; ?>
				</label>
				<?php endforeach; ?>
			</div>

			<?php echo $this->map_hint( $show_hint, $hint ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
