<?php
defined( 'ABSPATH' ) || exit;

/**
 * Handles the uploads and various function that includes multimedia
 */
class Bucket {
	private const plugin_upload_dir = 'gutenberg-forms-uploads';

    private const plugin_upload_path = WP_CONTENT_DIR . '/uploads' . '/' . self::plugin_upload_dir;

	/**
	 *
	 * upload
	 *
	 * @param file Uploads the file to the plugin_upload_directory
	 *
	 */
	public static function upload( $tmp_name, $extension ) {
		wp_mkdir_p( self::plugin_upload_path ); // creating the plugin_upload dir if not created

		$file_name = md5( uniqid( rand(), true ) ) . ".$extension";

		move_uploaded_file( $tmp_name, self::plugin_upload_path . '/' . $file_name );

		$file_path = self::plugin_upload_path . '/' . $file_name;

		return array(
			'path'     => $file_path,
			'filename' => $file_name,
		);
	}
}
