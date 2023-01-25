<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Website block.
 *
 * @since 2.9.9.1
 */
class Website extends FieldBlock {
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
		$field_style      = $attributes['className'] ?? 'is-style-default';

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

		$placeholder = $attributes['website'] ?? '';

		ob_start();
		?>
		<div
			class="cwp-website cwp-field <?php echo esc_attr( $field_style ); ?>"
			data-condition="<?php echo esc_attr( ! empty( $condition ) ? wp_json_encode( $condition ) : '' ); ?>"
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<div class="cwp-field-with-elements">
					<?php echo $this->map_prefix( $prefix['enable'], $prefix['content'], $prefix['position'] ); ?>

					<input
						name="<?php echo esc_attr( $id ); ?>"
						id="<?php echo esc_attr( $id ); ?>"
						type="url"
						required="<?php echo esc_attr( $is_required ); ?>"
						placeholder="<?php echo esc_attr( $placeholder ); ?>"
						title=""
						data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
						data-rule="false"
						data-cwp-field
					/>

					<?php echo $this->map_suffix( $suffix['enable'], $suffix['content'], $suffix['position'] ); ?>
				</div>
			</div>

			<?php echo $this->map_hint( $show_hint, $hint ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
