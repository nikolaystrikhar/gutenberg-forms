<?php 

require_once plugin_dir_path( __DIR__ ) . 'submissions/meta.php';
require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';


function get_value_and_name( $field ) {

    $value = $field['field_value'];
    $adminId = $field['decoded_entry']['admin_id'];

    $result = array();

    $result['value'] = $value;
    $result['admin_id'] = $adminId;

    return $result;
}

class Entries {


    const text_domain = "cwp-gutenberg-forms";
    const post_type = "cwp_gf_entries";

    public static function register_post_type() {

        $labels = generate_post_type_labels( 'Form Entries', "Entry" , "Entries" , self::text_domain );

        // registering post type for entries
        register_post_type (
            self::post_type,
            array(
                'labels' => $labels,
                'content' => false,
                'menu_icon' => 'dashicons-list-view',
                'description'        => __( 'For storing entries', self::text_domain ),
                'public'             => false,
                'publicly_queryable' => false,
                'show_ui'            => true,
                'show_in_menu'       => 'edit.php?post_type=cwp_gf_entries',
                'query_var'          => true,
                'rewrite'            => false,
                'capability_type'    => 'post',
                'has_archive'        => false,
                'hierarchical'       => false,
                'menu_position'      => null,
                'supports'           => false,
            )
        );

        // registering meta boxes and fields for entries cpt when the hook is ready
        if ( function_exists( 'add_meta_box' ) ) {
            Meta::register_meta_boxes( self::post_type );
        }

        // registering and creating custom columns for entries cpt
        //? set_custom_entries_columns -> functions.php
        add_filter( 'manage_'. self::post_type .'_posts_columns', 'manage_entries_columns_headers', 100 );
        add_filter( 'manage_'. self::post_type .'_posts_custom_column', 'get_custom_entries_columns', 100 , 2 );
        
    }

    public static function post( $entry = '' ) {


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

        $entry = apply_filters( self::text_domain , wp_parse_args( $entry, $defaults ) );

        $new_entry = new self();

        $new_entry->email = $entry['email'];
        $new_entry->template = $entry['template'];
        $new_entry->fields = $entry['fields'];

        $current_post = get_post( get_the_ID() );

        $new_entry->extra = array(
            'url' => get_page_link(),
            'remote_ip' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'],
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

        // inserting this submission into entries cpt

        $new_post = array(
            'post_title' => $new_entry->template['subject'],
            'post_status' => 'publish',
			'post_type'   => self::post_type,
        );


        $post_id = wp_insert_post( $new_post );

        if ( $post_id )  {
            // if the post has been created in the cpt
            // then updating the post meta in the cpt
            

            // updating template meta
            $template_meta_key = "template__" . self::post_type;
            $fields_meta_key = "fields__" . self::post_type;
            $extra_meta_key = "extra__" . self::post_type;

            update_post_meta( $post_id, $template_meta_key, $new_entry->template );
            update_post_meta( $post_id, $fields_meta_key, $new_entry->fields );
            update_post_meta( $post_id, $extra_meta_key, $new_entry->extra );

        }

    }

    public static function create_entry( $template, $subject , $body , $fields, $attachments = NULL ) {



        $new_entry = array();


        $new_entry['template'] = array(
            'subject' => $subject,
            'body'    => $body
        );

        $new_entry['fields'] = array();

        foreach ( $fields as $field_key => $field_value ) {

            $parse_entry = get_value_and_name($field_value);

            if ($field_value['field_type'] === 'file_upload') {


                $upload_dir_base = wp_get_upload_dir()['baseurl'];
                $filename = $upload_dir_base . '/gutenberg-forms-uploads/' . $field_value['file_name']; 

                $new_entry['fields'][ $parse_entry['admin_id'] ] = $filename; 
            } else {
                $new_entry['fields'][ $parse_entry['admin_id'] ] = $parse_entry['value']; 
            }

        }
        

        if ( array_key_exists('email', $template) ) {
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