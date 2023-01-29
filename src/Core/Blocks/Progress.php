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
		$styles = array(
			'base' => $this->map_style_attribute(
				array(
					'background-color' => $attributes['progressColor'],
					'height'           => $attributes['thickness'] . 'px',
					'border-radius'    => $attributes['cornerRadius'] . 'px',
				)
			),
			'fill' => $this->map_style_attribute(
				array(
					'background-color' => $attributes['progressFillColor'],
					'border-radius'    => $attributes['cornerRadius'] . 'px',
				)
			),
			'text' => $this->map_style_attribute(
				array(
					'color' => $attributes['textColor'],
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
				<?php if ( $attributes['showPercentage'] && $attributes['thickness'] > 10 ) : ?>
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
