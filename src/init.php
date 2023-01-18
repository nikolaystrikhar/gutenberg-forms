<?php
defined('ABSPATH') || exit;

function theHTML($attributes)
{
	return 'Hello, Krystian! It is a new block';

	$message = $attributes['message'];
	$isRequired = $attributes['isRequired'];
	$label = $attributes['label'];
	$id = $attributes['id'];
	$height = $attributes['isRequiheightred'];
	$requiredLabel = $attributes['requiredLabel'];
	$messages = $attributes['message'];
	$empty = $messages['empty'];
	$invalid = $messages->invalid;
	$pattern = $attributes->pattern;
	$condition = $attributes['condition'];
	$enableCondition = $attributes['enableCondition'];
	$minimumLength = $attributes['minimumLength'];
	$maximumLength = $attributes['maximumLength'];
	$hint = $attributes['hint'];
	$showHint = $attributes['showHint'];
	// JSON.stringify({ mismatch: invalid, empty})
	$errors = 'errors';

	function getLabel()
	{
		return 'getLabel';
	}

	function getPattern()
	{
		return 'getPattern';
	}

	function getCondition()
	{
		return 'getCondition';
	}

	function strip_tags()
	{
		'strip_tags';
	}

	function isEmpty()
	{
		return false;
	}

	ob_start(); ?>
	<p>Message V2</p>
	<div class="cwp-message cwp-field" <?php echo esc_html(getCondition()) ?>>
		<div class="cwp-field-set">
			<?php if (!isEmpty($label)) : ?>
				<label for='<?php echo $id; ?>' innerHTML="<?php echo getLabel(); ?>"></label>
			<?php endif; ?>

			<textarea id='<?php echo $id; ?>' aria-label="<?php esc_html(strip_tags($label)); ?>" style="height: <?php esc_html($height); ?>" data-cwp-field minlength="<?php echo esc_html($minimumLength); ?>" maxlength="<?php echo esc_html($maximumLength); ?>" name="<?php echo esc_html($id); ?>" title="<?php echo esc_html($invalid); ?>" required="<?php echo esc_html($isRequired); ?>" data-errors="<?php echo esc_html($errors); ?>" data-rule="false" <?php echo esc_html(getPattern()) ?> placeholder="<?php echo esc_html($message); ?>"></textarea>
		</div>
		<?php if ($showHint) : ?>
			<p class="cwp-hint"><?php esc_html($hint); ?></p>
		<?php endif; ?>
	</div>
<?php return ob_get_clean();
}


function get_forms_cpt_data()
{
	$posts = get_posts(
		array(
			'post_type'   => 'cwp_gf_forms',
			'post_status' => 'publish',
			'numberposts' => -1,
			'orderby'     => 'post_title',
			'order'       => 'ASC',
		)
	);

	$result = array();
	foreach ($posts as $post) {
		$result[] = array(
			'url'           => get_post_permalink($post->ID),
			'ID'            => $post->ID,
			'post_title'    => $post->post_title,
			'post_edit_url' => get_edit_post_link($post->ID),
		);
	}

	return $result;
}

function gutenberg_forms_cwp_block_assets(): void
{
	require_once plugin_dir_path(__DIR__) . 'admin/admin.php';

	$dashboard = new Dashboard();
	$dashboard->register_settings();

	wp_register_style(
		'gutenberg_forms-cwp-style-css',
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)),
		is_admin() ? array('wp-editor') : null,
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.style.build.css')
	);

	wp_register_script(
		'gutenberg_forms-cwp-block-js',
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)),
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'),
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.build.js')
	);

	register_block_type(
		'cwp/message-v2',
		array(
			'editor_script' => 'gutenberg_forms-cwp-block-js',
			'render_callback' => 'theHTML'
		)
	);

	wp_register_script(
		'gutenberg-forms-custom-js',
		plugins_url('/dist/frontend.js', dirname(__FILE__)),
		array('jquery'),
		filemtime(plugin_dir_path(__DIR__) . 'dist/frontend.js'),
		true
	);

	wp_register_style(
		'gutenberg_forms-cwp-block-editor-css',
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)),
		array('wp-edit-blocks'),
		filemtime(plugin_dir_path(__DIR__) . 'dist/blocks.editor.build.css')
	);

	wp_localize_script(
		'gutenberg_forms-cwp-block-js',
		'cwpGlobal',
		array(
			'pluginDirPath'   => plugin_dir_path(__DIR__),
			'pluginDirUrl'    => plugin_dir_url(__DIR__),
			'site_url'        => get_bloginfo('url'),
			'cwp-cpt-forms'   => get_forms_cpt_data(),
			'primary-color'   => get_user_option('admin_color'),
			'new_form_url'    => admin_url('post-new.php?post_type=cwp_gf_forms'),
			'admin_email'     => get_bloginfo('admin_email'),
			'settings'        => $dashboard->settings,
			'generalSettings' => json_decode(get_option('cwp_gutenberg_forms_general_settings'), JSON_PRETTY_PRINT),
		)
	);

	$files = array(
		'style'           => 'gutenberg_forms-cwp-style-css',
		'editor_script'   => 'gutenberg_forms-cwp-block-js',
		'editor_style'    => 'gutenberg_forms-cwp-block-editor-css',
		'assets_callback' => function ($attributes) {
			var_dump($attributes);
		},
	);

	if (!is_admin()) {
		$files['script'] = 'gutenberg-forms-custom-js';
	}

	register_block_type('cwp/block-gutenberg-forms', $files);
}

require_once plugin_dir_path(__DIR__) . 'triggers/email.php';

add_action(
	'wp_head',
	function () {
		require_once plugin_dir_path(__DIR__) . 'assets/index.assets.php';

		$assets_holder = new cwp_gf_AssetsHandler();
		$assets_holder->enqueue();
	}
);

add_action(
	'init',
	function (): void {
		require_once plugin_dir_path(__DIR__) . 'admin/cpt/entry.php';
		require_once plugin_dir_path(__DIR__) . 'admin/cpt/form.php';
		require_once plugin_dir_path(__DIR__) . 'controllers/index.php';

		register_post_meta('post', 'myguten_meta_block_field', array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string',
		));

		Form::register_post_type();
		Entries::register_post_type();

		wp_set_script_translations('gutenberg_forms-cwp-block-js', 'forms-gutenberg');

		gutenberg_forms_cwp_block_assets();
	}
);

function submitter()
{
	global $post;

	if (!empty($post)) {
		$post          = get_post($post->ID);
		$parsed_blocks = parse_blocks(do_shortcode($post->post_content));

		if (!empty($parsed_blocks)) {
			$email_apply = new Email($parsed_blocks);

			$email_apply->init();
		}
	}
}

add_action('wp_head', 'submitter');
add_action('wp-load', 'submitter');

add_filter(
	'plugin_row_meta',
	function (array $plugin_meta, string $plugin_file): array {
		if ('gutenberg-forms/gutenberg-forms.php' === $plugin_file) {
			$plugin_meta['settings'] = sprintf(
				'<a href="%s">%s</a>',
				esc_url(admin_url('admin.php?page=gutenberg_forms')),
				__('Dashboard', 'forms-gutenberg'),
			);
		}

		return $plugin_meta;
	},
	10,
	2
);
