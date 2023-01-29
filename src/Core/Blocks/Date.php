<?php
namespace GutenbergForms\Core\Blocks;

use GutenbergForms\Core\Helper;

defined( 'ABSPATH' ) || exit;

/**
 * Date block.
 *
 * @since 2.9.9.1
 */
class Date extends FieldBlock {
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

		$format = $attributes['format'] ?? 'DD/MM/YYYY';

		ob_start();
		?>
		<div
			class="cwp-datepicker cwp-field <?php echo esc_attr( $field_style ); ?>"
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
						type="text"
						<?php if ( $is_required ): ?>
							required
						<?php endif; ?>
						title=""
						data-errors="<?php echo esc_attr( ! empty( $error_messages ) ? wp_json_encode( $error_messages ) : '' ); ?>"
						data-rule="false"
						data-cwp-field
						readonly
						value="<?php echo esc_attr( $placeholder ); ?>"
						data-format="<?php echo esc_attr( $format ); ?>"
						data-validation="date"
						data-validation-format="dd/mm/yyyy"
						data-language="<?php echo esc_attr( Helper::get_language_code() ); ?>"
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
