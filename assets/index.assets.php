<?php
defined( 'ABSPATH' ) || exit;

class cwp_gf_AssetsHandler
{
	private array $blocks;

	public function __construct( array $blocks = array() ) {
        $this->blocks = $blocks;
    }

	public function enqueue(): void {
		if ( has_block( "cwp/block-gutenberg-forms" ) ) {
			wp_enqueue_script(
				'gutenberg-forms-google-recaptcha',
				plugins_url( '/', __FILE__ ) . 'scripts/google_recaptcha.js',
				array( 'jquery' ),
				filemtime( plugin_dir_path( __FILE__ ) . 'scripts/google_recaptcha.js' ),
				true
			);

			$locale = substr( get_bloginfo ( 'language' ), 0, 2 );

			wp_enqueue_script(
				'google-recaptcha',
				"https://www.google.com/recaptcha/api.js?hl=" . $locale,
				array( 'gutenberg-forms-google-recaptcha' ),
				'',
				true
			);
		}
	}
}
