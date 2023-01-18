<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Textarea block.
 *
 * @since 2.9.9.1
 */
class Textarea extends Block {
	private const NAME = 'cwp/message-v2'; // TODO: rename.

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
		$message         = $attributes['message'];
		$is_required     = $attributes['isRequired'];
		$label           = $attributes['label'];
		$id              = $attributes['id'];
		$height          = $attributes['isRequiheightred'];
		$requiredLabel   = $attributes['requiredLabel'];
		$messages        = $attributes['message'];
		$empty           = $messages['empty'];
		$invalid         = $messages->invalid;
		$pattern         = $attributes->pattern;
		$condition       = $attributes['condition'];
		$enableCondition = $attributes['enableCondition'];
		$min_length      = $attributes['minimumLength'];
		$max_length      = $attributes['maximumLength'];
		$hint            = $attributes['hint'];
		$showHint        = $attributes['showHint'];
		// JSON.stringify({ mismatch: invalid, empty})
		$errors = 'errors';

		ob_start(); ?>
		<div class="cwp-message cwp-field" <?php //echo esc_html( getCondition() ) ?>>
			<div class="cwp-field-set">
				<label>Hello, Krystian! It is a new block</label>
				<?php /*if ( ! empty( $label ) ) : ?>
					<label for='<?php echo $id; ?>' innerHTML="<?php echo getLabel(); ?>"></label>
				<?php endif;*/ ?>

				<textarea
					id="<?php echo esc_attr( $id ); ?>"
					aria-label="<?php echo esc_attr( $label ); ?>"
					style="height: <?php echo esc_attr( $height ); ?>"
					minlength="<?php echo esc_attr( $min_length ); ?>"
					maxlength="<?php echo esc_attr( $max_length ); ?>"
					name="<?php echo esc_html( $id ); ?>"
					title="<?php echo esc_html( $invalid ); ?>"
					required="<?php echo esc_html( $is_required ); ?>"
					placeholder="<?php echo esc_html( $message ); ?>"
					data-errors="<?php echo esc_html( $errors ); ?>"
					data-rule="false"
					data-cwp-field
					<?php // echo esc_html( getPattern() ) ?>
				></textarea>
			</div>

			<?php if ( $showHint ): ?>
				<p class="cwp-hint">
					<?php esc_html( $hint ); ?>
				</p>
			<?php endif; ?>
		</div>
		<?php return ob_get_clean();
	}
}
