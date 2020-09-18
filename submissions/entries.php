<?php

require_once plugin_dir_path(__DIR__) . 'triggers/functions.php';
require_once plugin_dir_path(__DIR__) . 'triggers/validator.php';


function get_value_and_name($field)
{

    $value = $field['field_value'];
    $adminId = $field['decoded_entry']['admin_id'];

    $result = array();

    $result['value'] = $value;
    $result['admin_id'] = $adminId;

    return $result;
}

class Entries
{


    const text_domain = "cwp-gutenberg-forms";
    const post_type = "cwp_gf_entries";

    public static function register_post_type()
    {

        $labels = generate_post_type_labels('Form Entries', "Entry", "Entries", self::text_domain);

        // registering post type for entries
        register_post_type(
            self::post_type,
            array(
                'labels' => $labels,
                'content' => false,
                'menu_icon' => 'dashicons-list-view',
                'description'        => __('For storing entries', self::text_domain),
                'public'             => false,
                'publicly_queryable' => false,
                'show_ui'            => false,
                'show_in_menu'       => false,
                'query_var'          => true,
                'rewrite'            => false,
                'capability_type'    => 'post',
                'has_archive'        => false,
                'hierarchical'       => false,
                'menu_position'      => null,
                'supports'           => false,
                'show_in_rest'      => true
            )
        );
    }

    public static function post($entry = '')
    {


        // some default arguments for creating a new entry
        $defaults = array(
            'email' => '',
            'to'   => '',
            'template' => array(
                'subject' => '',
                'body' => ''
            ),
            'fields' => array()
        );
        $post_meta = $entry['post_meta'];

        $entry = apply_filters(self::text_domain, wp_parse_args($entry, $defaults));
        $form_label = trim($post_meta['title']) === "" ? $post_meta['form_id'] : $post_meta['title'];

        $new_entry = new self();

        $new_entry->email = $entry['email'];
        $new_entry->template = $entry['template'];
        $new_entry->fields = $entry['fields'];
        $new_entry->form_id = $post_meta['form_id'];
        $new_entry->field_types = [];

        if (array_key_exists('field_types',  $entry)) :
            $new_entry->field_types = $entry['field_types'];
        endif;

        $current_post = get_post(get_the_ID());


        $new_entry->extra = array(
            'url' => get_page_link(),
            'remote_ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
            'form_id' => $post_meta['form_id'],
            'form_label' => $form_label,
            'date' => date("Y/m/d"),
            'day' => date("l"),
            'time' => date("h:i:sa"),
            'post_id' => get_the_ID(),
            'post_title' => $current_post->post_title,
            'post_author' => $current_post->post_author,
            'site_title' => get_bloginfo('name'),
            'site_description' => get_bloginfo('description'),
            'site_url' => get_bloginfo('url'),
            'site_admin_email' => get_bloginfo('admin_email'),
        );

        $new_entry->status = 'unread';
        $new_entry->notes = json_encode([], JSON_PRETTY_PRINT);


        // inserting this submission into entries cpt

        $new_post = array(
            'post_title' => $form_label,
            'post_status' => 'publish',
            'post_type'   => self::post_type,
        );


        $post_id = wp_insert_post($new_post);

        if ($post_id) {
            // if the post has been created in the cpt
            // then updating the post meta in the cpt

            // updating template meta
            $template_meta_key = "template__" . self::post_type;
            $fields_meta_key = "fields__" . self::post_type;
            $extra_meta_key = "extra__" . self::post_type;
            $form_id_meta_key = "form_id__" . self::post_type;
            $status_meta_key = "status__" . self::post_type;
            $notes_meta_key = "notes__" . self::post_type;
            $field_types_meta_key = "field_types__" . self::post_type;

            update_post_meta($post_id, $template_meta_key, $new_entry->template);
            update_post_meta($post_id, $fields_meta_key, $new_entry->fields);
            update_post_meta($post_id, $extra_meta_key, $new_entry->extra);
            update_post_meta($post_id, $form_id_meta_key, $new_entry->form_id);
            update_post_meta($post_id, $status_meta_key, $new_entry->status);
            update_post_meta($post_id, $notes_meta_key, $new_entry->notes);
            update_post_meta($post_id, $field_types_meta_key, $new_entry->field_types);
        }
    }

    public static function create_entry($template, $subject, $body, $fields, $attachments = NULL)
    {

        $new_entry = array();

        $new_entry['template'] = array(
            'subject' => $subject,
            'body'    => $body
        );

        $new_entry['fields'] = array();
        $new_entry['field_types'] = array();

        $new_entry['post_meta'] = array(
            'title' => '',
            'form_id' => '',
            'post_id'   => get_the_ID(),
            'site_url' => get_bloginfo('url'),
            'admin_url' => admin_url('admin.php?page=gutenberg_forms')
        );

        $new_entry['extended_data']     = $template['extendedData'];
        $new_entry['extended_fields']   =  $fields;

        foreach ($fields as $field_key => $field_value) {

            $is_hidden_field = Validator::is_hidden_data_field($field_value['field_id']);
            $is_recaptcha_field = $field_value['field_id'] === 'g-recaptcha-response';
            $parse_entry = get_value_and_name($field_value);
            $field_admin_id = $parse_entry['admin_id'];
            $field_type = $field_value['field_type'];

            $new_entry['field_types'][$field_admin_id] = $field_type;

            if ($field_value['field_type'] === 'file_upload' and !$is_recaptcha_field) {

                $parse_entry = get_value_and_name($field_value);

                $upload_dir_base = wp_get_upload_dir()['baseurl'];
                $filename = $upload_dir_base . '/gutenberg-forms-uploads/' . $field_value['file_name'];

                $new_entry['fields'][$parse_entry['admin_id']] = $filename;
            } else if ($is_hidden_field and !$is_recaptcha_field) {



                if ($field_value['field_id'] === 'gf_form_label') {

                    $new_entry['post_meta']['title'] = $field_value['field_value'];
                } else if ($field_value['field_id'] === 'gf_form_id') {

                    $new_entry['post_meta']['form_id'] = $field_value['field_value'];
                }
            } else if (!$is_hidden_field and !$is_recaptcha_field) {
                $parse_entry = get_value_and_name($field_value);
                $new_entry['fields'][$parse_entry['admin_id']] = $parse_entry['value'];
            }
        }

        if (array_key_exists('integrations', $template)) {
            $new_entry['integrations'] = $template['integrations'];
        }


        if (array_key_exists('email', $template)) {
            // this means the email is provided
            $new_entry['email'] = $template['email'];
        } else {
            // this means that the email will be sent to the admin email so,
            $new_entry['email'] = get_bloginfo('admin_email');
        }


        if (!is_null($attachments)) {
            $new_entry['attachments'] = $attachments;
        }

        return $new_entry;
    }
}
