<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __DIR__ ) . 'admin/admin.php';
require_once plugin_dir_path( __DIR__ ) . 'tagsHandler/tagHandler.php';

/**
 * All Integrations hooks will be called from here.
 */
class  ExternalServiceHandler {
	/**
	 * Will return the integration matching the current slug
	 *
	 * @param string $slug
	 *
	 * @return array $integration
	 */

	public static function get( $slug ) {
		$dashboard                    = new Dashboard();
		$settings                     = $dashboard->settings;
		$all_integrations             = array_key_exists( 'integrations', $settings ) ? $settings['integrations'] : [];
		$required_integration_details = [];

		if ( array_key_exists( $slug, $all_integrations ) ) {
			$required_integration_details = $all_integrations[ $slug ];
		}

		return $required_integration_details;
	}

	public static function is_field_id( $name ) {
		if ( is_array( $name ) ) {
			return false;
		}

		$res     = false;
		$breaked = explode( '_', $name );
		$fields  = [
			'name',
			'email',
			'radio',
			'checkbox',
			'message',
			'datepicker',
			'file_upload',
			'number',
			'phone',
			'select',
			'text',
			'website',
			'yes_no',
		];

		if ( array_key_exists( 0, $breaked ) and in_array( $breaked[0], $fields ) ) {
			$res = true;
		}


		return $res;
	}

	public static function parse_entry( $entry, $integration ) {
		$fields = $entry['fields'];

		$integration_with_values = array();

		foreach ( $integration as $name => $field_id ) {

			if ( gettype( $field_id ) === 'string' and array_key_exists( $field_id, $fields ) ) {
				$integration_with_values[ $name ] = $fields[ $field_id ];
			} elseif ( self::is_field_id( $field_id ) ) {
				$integration_with_values[ $name ] = '';
			} else {
				$integration_with_values[ $name ] = $field_id;
			}
		}

		return $integration_with_values;
	}

	public static function test( $entry ) {
		$integrations = $entry['integrations'];

		# if all the integrations are satisfied with the entry
		# then we can proceed with the submission
		$integrations_status  = [];
		$integration_response = null;

		foreach ( $integrations as $name => $integration ) {

			$parsed_entry = self::parse_entry( $entry, $integration );

			# adding the status of this integration in all status
			$response = apply_filters( 'gutenberg_forms_submission__status__' . $name, $parsed_entry );


			if ( array_key_exists( 'can_proceed', $response ) ) {

				$integrations_status[] = $response['can_proceed'];
			}

			if ( array_key_exists( 'can_proceed', $response ) and $response['can_proceed'] === false ) {

				$integration_response = $response;
			}
		}

		$can_proceed_with_submission = ! in_array( false, $integrations_status, true );

		if ( $can_proceed_with_submission ) {
			return true;
		}

		return $integration_response;
	}

	public function handle( $entry ) {

		$integrations = $entry['integrations'];

		$integrations_response = self::test( $entry );

		if ( gettype( $integrations_response ) === 'array' and $integrations_response['can_proceed'] === false ) {
			return;
		}

		foreach ( $integrations as $name => $integration ) {

			$parsed_entry        = $this->parse_entry( $entry, $integration );
			$integration_details = self::get( $name );

			# Some integrations can add an option in their config
			# to include all available fields
			# without field mapping

			$include_all_fields_in_entry = array_key_exists( 'include_all_fields', $integration_details ) ? $integration_details['include_all_fields'] : false;
			$include_extra_in_entry      = array_key_exists( 'include_extra', $integration_details ) ? $integration_details['include_extra'] : false;
			$include_extended_data       = array_key_exists( 'include_extended_data', $integration_details ) ? $integration_details['include_extended_data'] : false;
			$include_extended_fields     = array_key_exists( 'include_extended_fields', $integration_details ) ? $integration_details['include_extended_fields'] : false;

			if ( $include_all_fields_in_entry and ! $include_extra_in_entry ) :
				$parsed_entry = $entry['fields']; # replacing field mapped entry with all available fields
			endif;

			if ( $include_all_fields_in_entry and $include_extra_in_entry ) :

				$parsed_entry = $entry;

			endif;

			if ( ! $include_all_fields_in_entry and $include_extra_in_entry ) :

				$new_entry           = $entry;
				$new_entry['fields'] = $parsed_entry;

				$parsed_entry = $new_entry;

			endif;

			if ( $include_extended_data ) {
				$parsed_entry['extended_data'] = $entry['extended_data'];
			}

			if ( $include_extended_fields ) {
				$parsed_entry['extended_fields'] = $entry['extended_fields'];
			}

			# finally proceeding
			do_action(
				'gutenberg_forms_submission__' . $name,
				$parsed_entry
			);
		}
	}
}
