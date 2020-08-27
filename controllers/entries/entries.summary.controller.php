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

        $field_responses = [];
        $args = [
            'post_type'      => self::post_type,
            'posts_per_page' => $per_page,
            'paged'           => $page,
            'meta_key'       => 'form_id__' . self::post_type,
            'meta_value'     => $form_id,
        ];

        $entries = get_posts($args);

        foreach ($entries as $key => $entry) :

            $fields_meta_key = 'fields__' . self::post_type;
            $fields = get_post_meta($entry->ID, $fields_meta_key, true);

            $required_field = array_key_exists($field_id, $fields) ? $fields[$field_id] : null;

            if (!is_null($required_field))
                $field_responses[] = $required_field;

        endforeach;

        # deleting some un-used arguments for wp_query 

        unset($args['paged']);
        unset($args['posts_per_page']);

        $entries_query = new WP_Query($args);
        $total_entries = $entries_query->found_posts;


        return [
            'response'      => $field_responses,
            'total_entries' => $total_entries,

        ];
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
