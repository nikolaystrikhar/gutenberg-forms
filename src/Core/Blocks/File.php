<?php
namespace GutenbergForms\Core\Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * File block.
 *
 * @since 2.9.9.1
 */
class File extends FieldBlock {
	private const NAME = 'cwp/file-upload';

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
		$error_messages   = $attributes['messages'] ?? array();
		$enable_condition = $attributes['enableCondition'] ?? false;
		$condition        = $enable_condition
			? $attributes['condition'] ?? ''
			: '';

		// Custom attributes.

		$allowed_formats = $attributes['accept'] ?? array(
			"jpg",
			"jpeg",
			"png",
			"gif",
			"pdf",
			"doc",
			"docx",
			"ppt",
			"pptx",
			"odt",
			"avi",
			"ogg",
			"m4a",
			"mov",
			"mp3",
			"mp4",
			"mpg",
			"wav",
			"wmv"
		);

		$allowed_formats = array_map(
			function($item) {
				return '.' . $item;
			},
			$allowed_formats
		);

		$allowed_formats = implode(',', $allowed_formats);

		ob_start();
		?>
		<div class="cwp-file cwp-field" data-condition="<?php echo esc_attr( wp_json_encode( $condition ) ); ?>">
			<div class="cwp-field-set">
				<?php echo $this->map_label( $is_required, $label, $required_label, $id ); ?>

				<input
					name="<?php echo esc_attr( $id ); ?>"
					id="<?php echo esc_attr( $id ); ?>"
					type="file"
					required="<?php echo esc_attr( $is_required ); ?>"
					title=""
					data-errors="<?php echo esc_attr( wp_json_encode( $error_messages ) ); ?>"
					data-rule="false"
					data-cwp-field
					accept="<?php echo esc_attr( $allowed_formats ); ?>"
				/>
			</div>

			<?php echo $this->map_hint( $show_hint, $hint ); ?>
		</div>
		<?php
		return ob_get_clean();
	}
}
