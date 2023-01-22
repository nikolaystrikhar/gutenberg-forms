<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * yesNo block.
 *
 * @since 2.9.9.1
 */
class Toggle extends FieldBlock {
	private const NAME = 'cwp/yes-no';

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
		$placeholder      = $attributes['message'] ?? '';
		$error_messages   = $attributes['messages'] ?? array();
		$enable_condition = $attributes['enableCondition'] ?? false;
		$condition        = $enable_condition
			? $attributes['condition'] ?? ''
			: '';

		$prefix = $attributes['prefix'] ?? array(
			'enable'   => false,
			'content'  => '',
			'position' => 'outside',
		);
		$suffix = $attributes['suffix'] ?? array(
			'enable'   => false,
			'content'  => '',
			'position' => 'outside',
		);

		// Custom attributes.

		$enabled = $attributes['yes_no'] ?? false;

		ob_start();
		?>
		<div class="cwp-yes-no cwp-field" data-condition="<?php echo esc_attr( wp_json_encode( $condition ) ); ?>">
			<div class="cwp-field-set">
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<label class="cwp-switch">
					<input
						name="<?php echo esc_attr( $id ); ?>"
						id="<?php echo esc_attr( $id ); ?>"
						type="hidden"
						value="<?php echo esc_attr( $enabled ? 'yes' : 'no' ); ?>"
						readOnly
					/>

					<input
						name="<?php echo esc_attr( $id ); ?>"
						id="<?php echo esc_attr( $id ); ?>"
						type="checkbox"
						required="<?php echo esc_attr( $is_required ); ?>"
						data-cwp-field
						checked="<?php echo esc_attr( $enabled ? 'checked' : '' ); ?>"
					/>

					<span class="cwp-slider"></span>
				</label>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
