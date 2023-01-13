<?php
defined( 'ABSPATH' ) || exit;

/**
 * TagHandler
 * This class will handle the tag manipulation & insertion of dynamic content
 */
class gforms_TagHandler {
	public function __construct( $fields ) {
		$this->data   = array(); // data with their respective tags
		$this->fields = $fields; // form fields
		$this->get_data(); // fill up the data
	}

	private function add_field_data( $data ) {
		foreach ( $this->fields as $key => $field ) {
			$decoded_entry = $field['decoded_entry'];

			if ( array_key_exists( 'admin_id', $decoded_entry ) ) {

				$tag = "{{" . $field['field_type'] . "-" . $field['field_data_id'] . "}}";;
				$value        = $field['field_value'];
				$data[ $tag ] = $value;
			} elseif ( $field['field_id'] === "gf_form_id" ) {

				$data['{{form:form_id}}'] = $field['field_value'];
			} elseif ( $field['field_id'] === "gf_form_label" ) {
				$data['{{form:form_label}}'] = $field['field_value'];
			}
		}

		return $data;
	}

	public function get_query_params(): array {
		$query_string = $_SERVER['QUERY_STRING'];
		parse_str( $query_string, $output );

		$unique_query = array_unique( $output );
		$params       = array();

		foreach ( $unique_query as $key => $value ) {

			$tag = "{{query:$key}}";

			$params[ $tag ] = $value;
		}

		return $params;
	}

	public function get_data() {
		$post     = get_post( get_the_ID() );
		$post_url = get_page_link();

		$post_author       = get_the_author_meta( 'display_name', $post->post_author );
		$post_author_email = get_the_author_meta( 'email', $post->post_author );

		$meta = get_post_meta( $post->ID );

		$user_id = get_current_user_id();
		$user    = wp_get_current_user();

		$data = array(
			'{{wp:post_id}}'           => $post->ID,
			'{{wp:post_title}}'        => $post->post_title,
			'{{wp:post_url}}'          => $post_url,
			'{{wp:post_author}}'       => $post_author,
			'{{wp:post_author_email}}' => $post_author_email,
			'{{wp:user_id}}'           => $user_id,
			'{{wp:user_first_name}}'   => get_user_meta( $user_id, 'first_name', true ),
			'{{wp:user_last_name}}'    => get_user_meta( $user_id, 'last_name', true ),
			'{{wp:user_display_name}}' => $user->display_name,
			'{{wp:user_username}}'     => $user->user_login,
			'{{wp:user_email}}'        => $user->user_email,
			'{{wp:user_url}}'          => $user->user_url,
			'{{wp:site_url}}'          => get_site_url(),
			'{{wp:site_title}}'        => get_bloginfo( 'name' ),
			'{{wp:admin_email}}'       => get_bloginfo( 'admin_email' ),
			'{{other:date}}'           => date( "Y/m/d" ),
			'{{other:time}}'           => date( "h:i:sa" ),
			'{{all_data}}'             => $this->merge_fields_with_ids( $this->fields ),
		);

		$data = $this->add_field_data( $data );
		$data += $this->get_query_params();

		foreach ( $meta as $key => $value ) {
			$value = get_post_meta( $post->ID, $key, true );
			$tag   = "{{post_meta:{$key}}}";

			$data[ $tag ] = $value;
		}

		$this->data = $data;
	}

	private function merge_fields_with_ids( $fields ) {
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

	/**
	 * function merge
	 *
	 * @argument string $input - The input of the string that will be manipulated using tags to insert dynamic data
	 */
	public function merge( $input ) {

		if ( empty( $input ) or is_null( $input ) or gettype( $input ) !== 'string' ) {
			return $input;
		}

		return strtr( $input, $this->data );
	}
}

/**
 * gforms_add_dynamic_values will add dynamic values to all hidden fields
 *
 * @param array $fields
 */

function gforms_add_dynamic_values( $fields ) {
	$tagHandler = new gforms_TagHandler( $fields );

	foreach ( $fields as $key => $field ) {
		if ( $field['field_type'] === 'hidden' ) {

			$value             = $field['field_value'];
			$with_dynamic_data = $tagHandler->merge( $value );

			$fields[ $key ]['field_value'] = $with_dynamic_data;
		}
	}

	return $fields;
}
