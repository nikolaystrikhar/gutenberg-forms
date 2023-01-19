<?php

namespace GutenbergForms\Core\Blocks;

defined('ABSPATH') || exit;

/**
 * Textarea block.
 *
 * @since 2.9.9.1
 */
class Textarea extends Block
{
	private const NAME = 'cwp/message-v2'; // TODO: rename.

	/**
	 * Returns a block name.
	 *
	 * @since 2.9.9.1
	 *
	 * @return string
	 */
	public static function get_name(): string
	{
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
	public function render(array $attributes): string
	{
		$message         = $attributes['message'];
		$is_required     = $attributes['isRequired'];
		$label           = $attributes['label'];
		$id              = $attributes['id'];
		$height          = $attributes['height'];
		$required_label   = $attributes['requiredLabel'];
		$messages        = $attributes['messages'];
		$empty           = $messages['empty'];
		$invalid         = $messages['invalid'];
		$pattern         = $attributes['pattern'];
		$condition       = $attributes['condition'];
		$enable_condition = $attributes['enableCondition'];
		$min_length      = $attributes['minimumLength'];
		$max_length      = $attributes['maximumLength'];
		$hint            = $attributes['hint'];
		$show_hint        = $attributes['showHint'];
		$errors = json_encode(array("mismatch" => $invalid, "empty" => $empty));

		// TODO test and refactor
		function getLabel($required_label, $label, $is_required)
		{
			// ! don't know for sure if php empty() is this same as lodash isEmpty()
			$required = empty($required_label) ? '<abbr title="required" aria-label="required">' .  $required_label . '</abbr>' : "";
			$required_label = $label . " " . $required;
			if ($is_required) return $required_label;

			return $label;
		}

		// TODO what is Pattern?
		function getPattern($pattern)
		{
			return empty($pattern) ? "" : $pattern;
		}

		// TODO test and refactor
		function getCondition($enable_condition, $condition)
		{
			if ($enable_condition and !empty($condition->field)) {
				//verifying the condition
				return 'data-condition: ' . json_encode($condition);
			}

			return "";
		}

		// TODO check aria-label="<?php echo esc_html(strip_tags($label));
		// in save.js it was imported a helper fn to strip tags, php has build in fn fot that 
ob_start(); ?>
<div class="cwp-message cwp-field" <?php echo esc_html(getCondition($enable_condition, $condition)) ?>>
	<div class="cwp-field-set">
		<?php if (!empty($label)) : ?>
			<label for='<?php echo $id; ?>'><?php echo esc_html(getLabel($required_label, $label, $is_required)); ?></label>
		<?php endif; ?>
		<textarea
			id="<?php echo esc_attr($id); ?>"
			aria-label="<?php echo esc_html(strip_tags($label)); ?>"
			style="height: <?php echo esc_attr($height); ?>"
			minlength="<?php echo esc_attr($min_length); ?>"
			maxlength="<?php echo esc_attr($max_length); ?>"
			name="<?php echo esc_html($id); ?>"
			title="<?php echo esc_html($invalid); ?>"
			required="<?php echo esc_html($is_required); ?>"
			placeholder="<?php echo esc_html($message); ?>"
			data-errors="<?php echo esc_html($errors); ?>"
			data-rule="false"
			data-cwp-field <?php echo esc_html(getPattern($pattern)) ?>>
		</textarea>
	</div>

	<?php if ($show_hint) : ?>
		<p class="cwp-hint">
			<?php esc_html($hint); ?>
		</p>
	<?php endif; ?>
</div>
<?php return ob_get_clean();
	}
}