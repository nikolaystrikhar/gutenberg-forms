<?php

/**
 * @param array $array
 * @param array $keys
 *
 * This function removes certain keys from the associative array
 *
 * @return array
 */

function array_remove_keys($array, $keys)
{

	$assocKeys = array();
	foreach ($keys as $key) {
		$assocKeys[$key] = true;
	}

	return array_diff_key($array, $assocKeys);
}


/**
 * This function will generate labels for a custom cpt
 * 
 * @param string name The Name of the post_type
 * @param string singular The singular name of the post_type
 * @param string plural The plural name of the post_type
 */

function generate_post_type_labels($name, $singular, $plural, $text_domain)
{

	return array(
		'name' => __($name, $text_domain),
		'singular_name' => __($name, $text_domain),
		'menu_name'             => __($plural, $text_domain),
		'name_admin_bar'        => __($plural, $text_domain),
		'archives'              => __("$plural Archives", $text_domain),
		'attributes'            => __("$plural Attributes", $text_domain),
		'parent_item_colon'     => __("$plural:", $text_domain),
		'all_items'             => __("All $plural", $text_domain),
		'add_new_item'          => __("Add New $singular", $text_domain),
		'add_new'               => __("Add $singular", $text_domain),
		'new_item'              => __("New $singular", $text_domain),
		'edit_item'             => __("Edit $singular", $text_domain),
		'update_item'           => __("Update $singular", $text_domain),
		'view_item'             => __("View $singular", $text_domain),
		'view_items'            => __("View $plural", $text_domain),
		'search_items'          => __("Search $plural", $text_domain),
		'not_found'             => __("$singular Not found", $text_domain),
		'not_found_in_trash'    => __("$singular Not found in Trash", $text_domain),
		'featured_image'        => __('Featured Image', $text_domain),
		'set_featured_image'    => __('Set featured image', $text_domain),
		'remove_featured_image' => __('Remove featured image', $text_domain),
		'use_featured_image'    => __('Use as featured image', $text_domain),
		'insert_into_item'      => __('Insert into item', $text_domain),
		'uploaded_to_this_item' => __('Uploaded to this item', $text_domain),
		'items_list'            => __("$singular list", $text_domain),
		'items_list_navigation' => __("$singular list navigation", $text_domain),
		'filter_items_list'     => __("Filter $singular list", $text_domain),
	);
}


function manage_form_columns_headers($defaults)
{

	$headers = array();

	$headers['title'] = $defaults['title'];
	$headers['shortcode'] = 'Short Code';
	$headers['date'] = $defaults['date'];

	return $headers;
}

function get_custom_form_columns($column_name, $post_id)
{


	$short_code_style =  'font-family: monospace;background-color: #eee; width: 100%; background: transparent; border: none; height: 30px; padding: 0px 4px;';


	switch ($column_name) {

		case 'shortcode':
			echo "<input style='$short_code_style' onFocus='this.select();' value='[gutenberg_form id=" . $post_id . "]' readonly />";
	}
}

function get_forms_cpt_data()
{

	$args = array(
		'post_type' => 'cwp_gf_forms'
	);

	$form_cpt = get_posts($args);
	$posts = [];


	foreach ($form_cpt as $key => $post) {

		$posts[] = [
			'url' => get_post_permalink($post->ID),
			'ID'  => $post->ID,
			'post_title' => $post->post_title,
			'post_edit_url' => get_edit_post_link($post->ID)
		];
	}

	return $posts;
}

function merge_fields_with_ids($fields)
{

	$merged_fields = '';

	foreach ($fields as $key => $value) {

		$field_value = $value['field_value'];
		$id = array_key_exists('admin_id', $value['decoded_entry']) ? $value['decoded_entry']['admin_id'] : NULL;

		if (!empty($id) and !empty($field_value)) {

			$merged_fields .= "$id: $field_value \n";
		}
	}

	return $merged_fields;
}

function get_all_plugins_data()
{

	$plugins_list = get_plugins();
	$data = [];

	foreach ($plugins_list as $key => $plugin) {

		$plugin_data = [];

		if (array_key_exists('TextDomain', $plugin)) {
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
 * @param string $str 
 */

function replace_line_break_entities($str)
{
	$without_special_chars = strtr($str, [
		'&#10;' => "\n",
		'&#13;' => "\n",
	]);

	$with_html = nl2br($without_special_chars);
	return $with_html;
}

/**
 * 
 * @param array keys
 * @param array arr
 * Will order the given array with the given key order
 * 
 */

function cwp_gf_order_by($keys, $arr)
{
	$ordered_arr = [];

	foreach ($keys as $key) :

		if (!array_key_exists($key, $arr)) {
			$ordered_arr[$key] = "";
		} else {
			$ordered_arr[$key] = $arr[$key];
		}

	endforeach;

	return $ordered_arr;
}
