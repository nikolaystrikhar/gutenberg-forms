<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * FormCalculation block.
 *
 * @since 2.9.9.1
 */
class FormCalculation extends Block {
	// TODO update NAME
	private const NAME = 'cwp/form-calculation';

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
		$error_messages   = $attributes['messages'] ?? '';
		$enable_condition = $attributes['enableCondition'] ?? false;
		$condition        = $enable_condition
			? $attributes['condition'] ?? ''
			: '';

		// Custom attributes.
    // TODO add custom attributes

		ob_start();
		?>
    // TODO remove FormCalculation name
    <h2>FormCalculation</h2>
		<!-- <div class="cwp-email cwp-field" data-condition="<?php //echo esc_html( wp_json_encode( $condition ) ); ?>">
			<div class="cwp-field-set">
				<?php //if ( ! empty( $label ) ) : ?>
					<label for="<?php //echo esc_attr( $id ); ?>">
						<?php //echo esc_html( $label ); ?>

						<?php //if ( $is_required && ! empty( $required_label ) ) : ?>
							<abbr title="required" aria-label="required">
								<?php //echo esc_html( $required_label ); ?>
							</abbr>
						<?php //endif; ?>
					</label>
				<?php //endif; ?>

				<TODO
					name="<?php //echo esc_attr( $id ); ?>"
					id="<?php //echo esc_attr( $id ); ?>"
					type="email"
					required="<?php //echo esc_attr( $is_required ); ?>"
					placeholder="<?php //echo esc_attr( $placeholder ); ?>"
					title=""
					data-errors="<?php //echo esc_attr( wp_json_encode( $error_messages ) ); ?>"
					data-rule="false"
					data-cwp-field
					data-validation="email"
					data-parsley-type="email"
				/>
			</div>

			<?php //if ( $show_hint && ! empty( $hint ) ): ?>
				<p class="cwp-hint">
					<?php //echo esc_html( $hint ); ?>
				</p>
			<?php //endif; ?>
		</div> -->
		<?php return ob_get_clean();
	}
}
