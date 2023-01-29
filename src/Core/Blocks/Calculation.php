<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Calculation block.
 *
 * @since 2.9.9.1
 */
class Calculation extends FieldBlock {
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
		$style = $this->map_style_attribute(
			array(
				'font-size' => $attributes['styling']['fontSize'] . 'px',
			)
		);

		ob_start();
		?>
		<div
			class="cwp-calculation cwp-field"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
			data-cwp-calculation="<?php echo esc_attr( $attributes['formula'] ); ?>"
			data-deci="<?php echo esc_attr( $attributes['decimalPlaces'] ); ?>"
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( false, $attributes['label'], '', $attributes['id'] ); ?>

				<div class="cwp-result-wrap">
					<?php if ( ! empty( $attributes['prefix'] ) ): ?>
						<span style="<?php echo esc_attr( $style ); ?>">
							<?php echo esc_html( $attributes['prefix'] ); ?>
						</span>
					<?php endif; ?>

					<span class="cwp-calc-result" style="<?php echo esc_attr( $style ); ?>">
						0
					</span>

					<?php if ( ! empty( $attributes['suffix'] ) ): ?>
						<span style="<?php echo esc_attr( $style ); ?>">
							<?php echo esc_html( $attributes['suffix'] ); ?>
						</span>
					<?php endif; ?>
				</div>

				<input
					name="<?php echo esc_attr( $attributes['id'] ); ?>"
					id="<?php echo esc_attr( $attributes['id'] ); ?>"
					type="hidden"
					data-rule="false"
					data-cwp-field
					placeholder=<?php echo esc_attr( $attributes['calculation'] ); ?>
				/>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
