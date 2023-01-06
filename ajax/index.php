<?php
defined( 'ABSPATH' ) || exit;

add_action(
	'wp_ajax_cwp_gf_update_entry_status',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'You do not have permission to do this.' );
		}

		update_post_meta(
			intval( wp_unslash( $_POST['id'] ) ),
			"status__cwp_gf_entries",
			sanitize_key( wp_unslash( $_POST['status'] ) )
		);

		wp_send_json_success();
	}
);

add_action(
	'wp_ajax_cwp_gf_delete_entry',
	function () {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'You do not have permission to do this.' );
		}

		wp_delete_post(
			intval( wp_unslash( $_POST['id'] ) )
		);

		wp_send_json_success();
	}
);
