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

		$placeholder = $attributes['number'] ?? '';
		$range_min   = $attributes['rangeMin'] ?? '';
		$range_max   = $attributes['rangeMax'] ?? '';
		$step        = $attributes['steps'] ?? '';

		ob_start();
		?>
		<div
			class="cwp-number cwp-field <?php echo esc_attr( $field_style ); ?>"
			<?php if ( ! empty( $condition ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $condition ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<div class="cwp-field-with-elements">
					<?php echo $this->map_prefix( $prefix['enable'], $prefix['content'], $prefix['position'] ); ?>

					<input
						name="<?php echo esc_attr( $id ); ?>"
						id="<?php echo esc_attr( $id ); ?>"
						type="number"
						<?php if ( $is_required ): ?>
							required
						<?php endif; ?>
						title=""
						data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
						data-rule="false"
						data-cwp-field
						data-default="<?php echo esc_attr( $placeholder ); ?>"
						value="<?php echo esc_attr( $placeholder ); ?>"
						step="<?php echo esc_attr( $step ); ?>"
						min="<?php echo esc_attr( $range_min ); ?>"
						max="<?php echo esc_attr( $range_max ); ?>"
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
