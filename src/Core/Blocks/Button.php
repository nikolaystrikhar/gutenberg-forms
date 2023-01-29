<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * Button block.
 *
 * @since 2.9.9.1
 */
class Button extends Block {
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
				'background-color' => $attributes['styling']['backgroundColor'],
				'color'            => $attributes['styling']['color'],
				'padding'          => floor( $attributes['styling']['padding'] / 3 ) . 'px ' . $attributes['styling']['padding'] . 'px',
				'border-radius'    => $attributes['styling']['borderRadius'] . 'px',
			)
		);

		ob_start();
		?>
		<?php if ( $attributes['action'] === 'submit' ): ?>
			<button
				name="submit"
				value="<?php echo esc_attr( $attributes['parentId'] ); ?>"
				type="submit"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $attributes['label'] ); ?>
			</button>
		<?php elseif ( $attributes['action'] === 'reset' ): ?>
			<button
				class="cwp-reset_btn"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $attributes['label'] ); ?>
			</button>
		<?php else: ?>
			<button
				data-trigger="<?php echo esc_attr( $attributes['action'] ); ?>"
				class="cwp-multistep_btn multistep-trigger"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $attributes['label'] ); ?>
			</button>
		<?php endif; ?>
		<?php
			return ob_get_clean();
	}
}
