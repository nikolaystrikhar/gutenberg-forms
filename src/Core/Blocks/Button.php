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

	private const NAME = 'cwp/form-button';

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

		$label     = $attributes['label'] ?? esc_html__( 'Submit', 'forms-gutenberg' );
		$action    = $attributes['action'] ?? 'submit';
		$parent_id = $attributes['parentId'] ?? '';
		$styling   = $attributes['styling'] ?? array(
			'backgroundColor' => '#6d6d6d',
			'color'           => 'rgb(49, 49, 49)',
			'padding'         => 25,
			'borderRadius'    => 0,
		);

		$style = $this->map_style_attribute(
			array(
				'background-color' => $styling['backgroundColor'],
				'color'            => $styling['color'],
				'padding'          => floor( $styling['padding'] / 3 ) . 'px ' . $styling['padding'] . 'px',
				'border-radius'    => $styling['borderRadius'] . 'px',
			)
		);

		ob_start();
		?>
		<?php if ( $action === 'submit' ): ?>
			<button
				name="submit"
				value="<?php echo esc_attr( $parent_id ); ?>"
				type="submit"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $label ); ?>
			</button>
		<?php elseif ( $action === 'reset' ): ?>
			<button
				class="cwp-reset_btn"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $label ); ?>
			</button>
		<?php else: ?>
			<button
				data-trigger="<?php echo esc_attr( $action ); ?>"
				class="cwp-multistep_btn multistep-trigger"
				style="<?php echo esc_attr( $style ); ?>"
			>
				<?php echo esc_html( $label ); ?>
			</button>
		<?php endif; ?>
		<?php
			return ob_get_clean();
	}
}
