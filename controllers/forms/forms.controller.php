<?php
defined( 'ABSPATH' ) || exit;

# Importing sub-controllers to make things organized
require_once plugin_dir_path( __FILE__ ) . 'forms.import.controller.php';

/**
 * - This controller does not meant to replicate the rest api functionality
 * - Using this forms controller only for getting the calculated stuff
 */
class cwp_gf_Forms_controller {
	const version = "v1"; # controller version

	const post_type = "cwp_gf_forms";

	public function __construct() {
		$this->namespace     = "/gutenberg-forms/forms/" . self::version;
		$this->resource_name = 'posts';
	}

	/**
	 * All rest route required for the current controller will be
	 * registered in the function below
	 */

	public function register_routes() {
		$sub_controllers = [
			new cwp_gf_Forms_Import_controller( $this->namespace ),
		];

		foreach ( $sub_controllers as $sub_controller ) {
			// registering routes for each sub controller
			$sub_controller->register_routes();
		}
	}
}
