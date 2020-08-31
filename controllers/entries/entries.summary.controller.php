<?php

# Rest Controller for handling the entries summary results for a single form entries

class cwp_gf_Entries_Summary_Controller extends WP_REST_Controller
{
    const version = "v1";
    const post_type = "cwp_gf_entries";

    public function __construct()
    {
        # root route
        $this->namespace = "/gutenberg-forms/entries/" . self::version;
        # resource used
        $this->resource = "post";
    }

    # handling rest api routes registrations
    public function register_routes()
    {
        register_rest_route($this->namespace, '/fields', array(

            array(
                'methods'   => 'GET',
                'callback'  => array($this, 'get_fields'),
            ),

        ));

        register_rest_route($this->namespace, 'summary/field', array(

            array(
                'methods'   => 'GET',
                'callback'  => array($this, 'get_field_summary'),
            ),

        ));
    }


    # Will return summary of single gutenberg form field
    public function get_field_summary($request)
    {
        $field_id = $request['field_id'];
        $form_id = $request['form_id'];
        $per_page = $request['per_page'];
        $page = $request['page'];
        $current_field_type = $request['field_type'];

        $field_responses = [];
        $total_field_responses = 0;
        $args = [
            'post_type'         => self::post_type,
            'posts_per_page'    => $per_page,
            'paged'             => $page,
            'meta_query'        => [
                'relation' => 'AND',
                [
                    'key'       => 'form_id__' . self::post_type,
                    'value'     => $form_id,
                    'compare'   => '='
                ],
                [
                    'key'       => 'fields__' . self::post_type,
                    'value'     => serialize(strval($field_id)),
                    'compare'   => 'LIKE'
                ]
            ]
        ];

        $entries = get_posts($args);
        $visual_info = [];

        foreach ($entries as $key => $entry) :

            $fields_meta_key = 'fields__' . self::post_type;

            $fields = get_post_meta($entry->ID, $fields_meta_key, true);

            $required_field = array_key_exists($field_id, $fields) ? $fields[$field_id] : null;

            if (!is_null($required_field) and $required_field !== '') {
                $field_responses[] = [
                    'value'     => $required_field,
                    'post_slug' => $entry->post_name
                ];
            }



        endforeach;

        # deleting some un-used arguments for wp_query 

        unset($args['paged']);
        unset($args['posts_per_page']);
        $args['meta_query'] = [
            [
                'key'       => 'form_id__' . self::post_type,
                'value'     => $form_id,
                'compare'   => '='
            ]
        ];

        $entries_query = new WP_Query($args);
        $total_entries = $entries_query->found_posts;


        foreach ($entries_query->posts as $key => $entry) :

            $fields = get_post_meta($entry->ID, 'fields__' . self::post_type, true);

            $required_field = array_key_exists($field_id, $fields) ? $fields[$field_id] : null;

            if (!is_null($required_field) and $required_field !== '') {
                $total_field_responses += 1;
            }

        endforeach;

        if ($current_field_type === 'checkbox') {
            $visual_info = $this->get_checkbox_visual($field_id, $entries_query->posts, $total_entries);
        } else if ($current_field_type === 'radio') {
            $visual_info = $this->get_radio_visual($field_id, $entries_query->posts, $total_entries);
        }


        return [
            'response'              => $field_responses,
            'total_entries'         => $total_entries,
            'total_field_responses' => $total_field_responses,
            'visual_info'           => $visual_info,
            'field_type'            => $current_field_type
        ];
    }


    /**
     * Will return the data required to preview radio field in a visual chart
     * @param string field_id id of the radio field
     * @param array entries
     * @param int total entries count
     */


    public function get_radio_visual($field_id, $entries, $total_entries)
    {
        $result = [];

        foreach ($entries as $key => $entry) :

            $fields = get_post_meta($entry->ID, 'fields__' . self::post_type, true);
            $radio_value = array_key_exists($field_id, $fields) ? $fields[$field_id] : "";

            if (!array_key_exists($radio_value, $result) and $radio_value !== '' and !empty($radio_value)) {

                # initializing the option start value
                $result[$radio_value] = [
                    'total'         => 1,
                    'percentage'    => floor((1 / $total_entries) * 100)
                ];
            } else if (array_key_exists($radio_value, $result) and $radio_value !== '' and !empty($radio_value)) {

                $prev_total = $result[$radio_value]['total'];
                $new_total = $prev_total + 1;

                $result[$radio_value] =  [
                    'total'         => $new_total,
                    'percentage'    => floor(($new_total  / $total_entries) * 100)
                ];
            }


        endforeach;

        return $result;
    }

    /**
     * Will return the data required to preview checkbox field in a visual chart
     * 
     * @param string field_id id of the checkbox field
     * @param array entries
     * @param int total entries count
     */

    public function get_checkbox_visual($field_id, $entries, $total_entries)
    {

        $result = [];

        foreach ($entries as $key => $entry) :

            $fields = get_post_meta($entry->ID, 'fields__' . self::post_type, true);
            $checkbox_value = array_key_exists($field_id, $fields) ? $fields[$field_id] : null;

            # converting value in an array
            # example value "hockey,football" -> ["hockey", "football"]
            $selected_options = is_null($checkbox_value) ? [] : explode(',', $checkbox_value);

            foreach ($selected_options as $option) :

                if (!array_key_exists($option, $result)) {

                    # initializing the option start value
                    $result[$option] = [
                        'total'         => 1,
                        'percentage'    => floor((1 / $total_entries) * 100)
                    ];
                } else {

                    $prev_total = $result[$option]['total'];
                    $new_total = $prev_total + 1;

                    $result[$option] =  [
                        'total'         => $new_total,
                        'percentage'    => floor(($new_total  / $total_entries) * 100)
                    ];
                }

            endforeach;


        endforeach;

        return $result;
    }

    # Will return form fields
    public function get_fields($request)
    {
        $form_id = $request['form_id'];
        $form_id_meta_key = "form_id__" . self::post_type;
        $fields_meta_key = 'fields__' . self::post_type;
        $field_type_meta_key = 'field_types__' . self::post_type;

        $entries = get_posts([
            'post_type'        => self::post_type,
            'meta_key'         => $form_id_meta_key,
            'meta_value'       => $form_id,
            'order'            => 'DESC',
        ]);

        $data = [
            'fields' => [],
            'types'  => [],
        ];

        # including meta keys

        foreach ($entries as $key => $entry) :

            $post_id = $entry->ID;
            $form_fields = get_post_meta($post_id, $fields_meta_key, true);
            $field_types = get_post_meta($post_id, $field_type_meta_key, true);
            $final_field_types = $field_types === "" ? [] : $field_types;

            foreach ($form_fields as $field_name => $field) :

                if (!in_array($field_name, $data['fields'])) {
                    $data['fields'][] = $field_name;

                    if (array_key_exists($field_name, $final_field_types) and !in_array($field_name, $data['types'])) {
                        $data['types'][$field_name] = $final_field_types[$field_name];
                    }
                }

            endforeach;

        endforeach;

        return $data;
    }
}
