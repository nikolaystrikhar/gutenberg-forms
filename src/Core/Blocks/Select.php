<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Select block.
 *
 * @since 2.9.9.1
 */
class Select extends FieldBlock {
	private const NAME = 'cwp/select';

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

		$options = $attributes['options'] ?? array();

		ob_start();
		?>
		<div class="cwp-select cwp-field" data-condition="<?php echo esc_attr( ! empty( $condition ) ? wp_json_encode( $condition ) : '' ); ?>">
			<div class="cwp-field-set cwp-select-set">
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<select
					name="<?php echo esc_attr( $id ); ?>"
					id="<?php echo esc_attr( $id ); ?>"
					required="<?php echo esc_attr( $is_required ); ?>"
					data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
					data-rule="false"
					data-cwp-field
				>
					<?php foreach ( $options as $option ) : ?>
						<option value="<?php echo esc_attr( $option['label'] ); ?>">
							<?php echo esc_html( $option['label'] ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</div>

			<?php echo $this->map_hint( $show_hint, $hint ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
