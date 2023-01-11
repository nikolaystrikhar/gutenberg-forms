<?php
defined( 'ABSPATH' ) || exit;

/**
 * @param array $array
 * @param array $keys
 *
 * This function removes certain keys from the associative array
 *
 * @return array
 */
function array_remove_keys( $array, $keys ) {
	$assocKeys = array();
	foreach ( $keys as $key ) {
		$assocKeys[ $key ] = true;
	}

	return array_diff_key( $array, $assocKeys );
}

function get_forms_cpt_data() {
	$args = array(
		'post_type' => 'cwp_gf_forms',
	);

	$form_cpt = get_posts( $args );
	$posts    = array();

	foreach ( $form_cpt as $post ) {
		$posts[] = [
			'url'           => get_post_permalink( $post->ID ),
			'ID'            => $post->ID,
			'post_title'    => $post->post_title,
			'post_edit_url' => get_edit_post_link( $post->ID ),
		];
	}

	return $posts;
}

function merge_fields_with_ids( $fields ) {
	$merged_fields = '';

	foreach ( $fields as $value ) {

		$field_value = $value['field_value'];
		$id          = array_key_exists( 'admin_id', $value['decoded_entry'] ) ? $value['decoded_entry']['admin_id'] : null;

		if ( ! empty( $id ) and ! empty( $field_value ) ) {
			$merged_fields .= "$id: $field_value \n";
		}
	}

	return $merged_fields;
}

function get_all_plugins_data() {
	$plugins_list = get_plugins();
	$data         = array();

	foreach ( $plugins_list as $key => $plugin ) {
		$plugin_data = array();

		if ( array_key_exists( 'TextDomain', $plugin ) ) {
			$plugin_data['textdomain'] = $plugin['TextDomain'];
		}

		$plugin_data['script'] = $key;

		$data[] = $plugin_data;
	}

	return $data;
}

/**
 * Will replace the following entities to their corresponding html element
 * &#10; => \n [new line] => <br />
 * &#13; => \n [new row] => <br />
 *
 * @param string $str
 */
function replace_line_break_entities( $str ) {
	$without_special_chars = strtr( $str, [
		'&#10;' => "\n",
		'&#13;' => "\n",
	] );

	$with_html = nl2br( $without_special_chars );

	return $with_html;
}

/**
 *
 * @param array keys
 * @param array arr
 * Will order the given array with the given key order
 *
 */
function cwp_gf_order_by( $keys, $arr ) {
	$ordered_arr = [];

	foreach ( $keys as $key ) :
		if ( ! array_key_exists( $key, $arr ) ) {
			$ordered_arr[ $key ] = "";
		} else {
			$ordered_arr[ $key ] = $arr[ $key ];
		}
	endforeach;

	return $ordered_arr;
}
