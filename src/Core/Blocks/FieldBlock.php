<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Field block.
 *
 * @since 2.9.9.1
 */
abstract class FieldBlock extends Block {
	/**
	 * Returns a label.
	 *
	 * @since 2.9.9.1
	 *
	 * @param bool   $is_required    Is required.
	 * @param string $label          Label.
	 * @param string $required_label Required label.
	 * @param string $input_id       Input ID.
	 *
	 * @return string
	 */
	protected function map_label( bool $is_required, string $label, string $required_label, string $input_id ): string {
		if ( empty( $label ) ) {
			return '';
		}

		ob_start();
		?>
		<label for="<?php echo esc_attr( $input_id ); ?>">
			<?php echo esc_html( $label ); ?>

			<?php if ( $is_required && ! empty( $required_label ) ) : ?>
				<abbr title="required" aria-label="required">
					<?php echo esc_html( $required_label ); ?>
				</abbr>
			<?php endif; ?>
		</label>
		<?php
		return ob_get_clean();
	}

	/**
	 * Returns a hint.
	 *
	 * @since 2.9.9.1
	 *
	 * @param bool   $enabled Hint enabled.
	 * @param string $text    Hint text.
	 *
	 * @return string
	 */
	protected function map_hint( bool $enabled, string $text ): string {
		if ( ! $enabled || empty( $text ) ) {
			return '';
		}

		ob_start();
		?>
		<p class="cwp-hint">
			<?php echo esc_html( $text ); ?>
		</p>
		<?php
		return ob_get_clean();
	}

	/**
	 * Returns a prefix.
	 *
	 * @since 2.9.9.1
	 *
	 * @param bool   $enabled  Prefix enabled.
	 * @param string $text     Prefix text.
	 * @param string $position Prefix position.
	 *
	 * @return string
	 */
	protected function map_prefix( bool $enabled, string $text, string $position ): string {
		if ( ! $enabled || empty( $text ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="cwp-prefix cwp-field-prefix cwp-field-element <?php echo esc_attr( $position ); ?>">
			<span>
				<?php echo esc_html( $text ); ?>
			</span>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Returns a suffix.
	 *
	 * @since 2.9.9.1
	 *
	 * @param bool   $enabled  Suffix enabled.
	 * @param string $text     Suffix text.
	 * @param string $position Suffix position.
	 *
	 * @return string
	 */
	protected function map_suffix( bool $enabled, string $text, string $position ): string {
		if ( ! $enabled || empty( $text ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="cwp-suffix cwp-field-suffix cwp-field-element <?php echo esc_attr( $position ); ?>">
			<span>
				<?php echo esc_html( $text ); ?>
			</span>
		</div>
		<?php
		return ob_get_clean();
	}
}
