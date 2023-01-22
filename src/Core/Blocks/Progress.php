<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Progress block.
 *
 * @since 2.9.9.1
 */
class Progress extends FieldBlock {
	use Traits\HasStyles;

	private const NAME = 'cwp/progress';

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
		// Custom attributes.

		$show_percentage     = $attributes['showPercentage'] ?? false;
		$progress_color      = $attributes['progressColor'] ?? 'rgb(238, 238, 238)';
		$progress_fill_color = $attributes['progressFillColor'] ?? 'rgb(6, 147, 227)';
		$text_color          = $attributes['textColor'] ?? 'rgb(238, 238, 238)';
		$thickness           = $attributes['thickness'] ?? 20;
		$corner_radius       = $attributes['cornerRadius'] ?? 0;

		$styles = array(
			'base' => $this->map_style_attribute(
				array(
					'background-color' => $progress_color,
					'height'           => $thickness . 'px',
					'border-radius'    => $corner_radius . 'px',
				)
			),
			'fill' => $this->map_style_attribute(
				array(
					'background-color' => $progress_fill_color,
					'border-radius'    => $corner_radius . 'px',
				)
			),
			'text' => $this->map_style_attribute(
				array(
					'color' => $text_color,
				)
			),
		);

		ob_start();
		?>
		<div
			class="cwp-gutenberg-form cwp-progress-bar"
			style="<?php echo esc_attr( $styles['base'] ); ?>"
		>
			<div class="bar-fill" style="<?php echo esc_attr( $styles['fill'] ); ?>">
				<?php if ( $show_percentage && $thickness > 10 ) : ?>
					<span class="percentage-indicator" style="<?php echo esc_attr( $styles['text'] ); ?>">
						50%
					</span>
				<?php endif; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
