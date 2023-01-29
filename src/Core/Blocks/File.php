<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * File block.
 *
 * @since 2.9.9.1
 */
class File extends FieldBlock {
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
		// TODO: Add hint support.

		$allowed_formats = implode(
			',',
			array_map(
				function($item) {
					return '.' . $item;
				},
				$attributes['allowedFormats']
			)
		);

		ob_start();
		?>
		<div
			class="cwp-file cwp-field <?php echo esc_attr( $attributes['className'] ?? 'is-style-default' ); ?>"
			<?php if ( ! empty( $attributes['condition']['field'] ) ): ?>
				data-condition="<?php echo esc_attr( wp_json_encode( $attributes['condition'] ) ); ?>"
			<?php endif; ?>
		>
			<div class="cwp-field-set">
				<?php echo $this->map_label( $attributes['isRequired'], $attributes['label'], $attributes['requiredLabel'], $attributes['id'] ); ?>

				<input
					name="<?php echo esc_attr( $attributes['id'] ); ?>"
					id="<?php echo esc_attr( $attributes['id'] ); ?>"
					type="file"
					<?php if ( $attributes['isRequired'] ): ?>
						required
					<?php endif; ?>
					title=""
					data-errors="<?php echo esc_attr( ! empty( $attributes['messages'] ) ? wp_json_encode( $attributes['messages'] ) : '' ); ?>"
					data-rule="false"
					data-cwp-field
					accept="<?php echo esc_attr( $allowed_formats ); ?>"
				/>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
