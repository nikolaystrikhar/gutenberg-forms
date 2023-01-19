<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Textarea block.
 *
 * @since 2.9.9.1
 */
class Textarea extends Block {
	private const NAME = 'cwp/message';

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
			? $attributes['condition'] ?? array()
			: array();

		// Custom attributes.

		$height     = $attributes['height'] ?? 200;
		$min_length = $attributes['minimumLength'] ?? 0;
		$max_length = $attributes['maximumLength'] ?? 524288;

		ob_start(); ?>
		<div class="cwp-message cwp-field" data-condition="<?php echo esc_html( wp_json_encode( $condition ) ); ?>">
			<div class="cwp-field-set">
				<?php if ( ! empty( $label ) ) : ?>
					<label for="<?php echo esc_attr( $id ); ?>">
						<?php echo esc_html( $label ); ?>

						<?php if ( $is_required && ! empty( $required_label ) ) : ?>
							<abbr title="required" aria-label="required">
								<?php echo esc_html( $required_label ); ?>
							</abbr>
						<?php endif; ?>
					</label>
				<?php endif; ?>

				<textarea
					name="<?php echo esc_attr( $id ); ?>"
					id="<?php echo esc_attr( $id ); ?>"
					required="<?php echo esc_attr( $is_required ); ?>"
					placeholder="<?php echo esc_attr( $placeholder ); ?>"
					title=""
					data-errors="<?php echo esc_attr( wp_json_encode( $error_messages ) ); ?>"
					data-rule="false"
					data-cwp-field
					style="height: <?php echo esc_attr( $height ); ?>"
					minlength="<?php echo esc_attr( $min_length ); ?>"
					maxlength="<?php echo esc_attr( $max_length ); ?>"
				></textarea>
			</div>

			<?php if ( $show_hint && ! empty( $hint ) ): ?>
				<p class="cwp-hint">
					<?php echo esc_html( $hint ); ?>
				</p>
			<?php endif; ?>
		</div>
		<?php return ob_get_clean();
	}
}
