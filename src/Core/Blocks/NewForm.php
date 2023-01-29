<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * NewForm block.
 *
 * @since 2.9.9.1
 */
class NewForm extends Block {
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
		ob_start();
		?>
    // TODO remove NewForm name
    <h2>NewForm</h2>
		<!-- <div class="cwp-email cwp-field" data-condition="<?php //echo esc_html( wp_json_encode( $attributes['condition'] ) ); ?>">
			<div class="cwp-field-set">
				<?php //if ( ! empty( $attributes['label'] ) ) : ?>
					<label for="<?php //echo esc_attr( $attributes['id'] ); ?>">
						<?php //echo esc_html( $attributes['label'] ); ?>

						<?php //if ( $attributes['isRequired'] && ! empty( $attributes['requiredLabel'] ) ) : ?>
							<abbr title="required" aria-label="required">
								<?php //echo esc_html( $attributes['requiredLabel'] ); ?>
							</abbr>
						<?php //endif; ?>
					</label>
				<?php //endif; ?>

				<TODO
					name="<?php //echo esc_attr( $attributes['id'] ); ?>"
					id="<?php //echo esc_attr( $attributes['id'] ); ?>"
					type="email"
					required="<?php //echo esc_attr( $attributes['isRequired'] ); ?>"
					placeholder="<?php //echo esc_attr( $placeholder ); ?>"
					title=""
					data-errors="<?php //echo esc_attr( wp_json_encode( $attributes['messages'] ) ); ?>"
					data-rule="false"
					data-cwp-field
					data-validation="email"
					data-parsley-type="email"
				/>
			</div>

			<?php //if ( $attributes['showHint'] && ! empty( $attributes['hint'] ) ): ?>
				<p class="cwp-hint">
					<?php //echo esc_html( $attributes['hint'] ); ?>
				</p>
			<?php //endif; ?>
		</div> -->
		<?php return ob_get_clean();
	}
}
