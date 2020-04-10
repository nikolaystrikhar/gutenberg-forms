<?php 

require_once plugin_dir_path( __DIR__ ) . 'submissions/meta.php';
require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';
require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';


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
        add_filter( 'manage_edit-'. self::post_type .'_sortable_columns', 'manage_entries_sortable_columns_headers' );

        add_action( 'restrict_manage_posts', function(){
            
            global $wpdb;

            $post = get_post( get_the_ID() );


            //only add filter to post type you want
            if ($post and $post->post_type === self::post_type){

                $forms = array();

                $entries = get_posts(
                    array(
                        'post_type' => self::post_type
                    )
                );


                foreach ($entries as $entry){

                    $entry_meta = get_post_meta(
                        $entry->ID,
                        'extra__' . self::post_type
                    );

                    $forms[$entry_meta[0]['form_id']] = $entry_meta[0]['form_label'];
                }

                # give a unique name in the select field
                ?>
                <select name="admin_filter_channel">
                    <option value="-1">All Channels</option>
    
                    <?php 
                        $current_v = isset($_GET['admin_filter_channel'])? $_GET['admin_filter_channel'] : '';
                        
                        foreach ($forms as $form_id => $form_label) {

                            printf(
                                '<option value="%s"%s>%s</option>',
                                $form_id,
                                $form_label == $current_v ? ' selected="selected"':'',
                                $form_label 
                            );

                        }
                    ?>
                </select>
                <?php
            }
        });

        add_filter( 'parse_query', function( $query ) {

            global $pagenow;

            $post_type = (isset($_GET['post_type'])) ? $_GET['post_type'] : 'post';
            

            if (is_admin() AND $post_type == self::post_type AND $pagenow == 'edit.php' AND isset($_GET['admin_filter_channel']) AND !empty($_GET['admin_filter_channel'])) {

                $qv = &$query->query_vars;
                $qv['meta_query'] = array();

                $channel = $_GET['admin_filter_channel'];  

                $qv['meta_query'][] = array(

                    'field' => 'form_id__' . self::post_type,
                    'value' => $channel,
                    'compare' => '=',
                );

            }
        });

        add_filter('post_row_actions', function( $actions, $post ) {


            // check if the current post_type is yours
            if ( is_admin() and $post->post_type === self::post_type ) {

                
                $post_meta = get_post_meta( 
                    $post->ID,
                    'extra__' . self::post_type
                );
                
                $post_url = $post_meta[0]['url'];
                $form_specific_post_url = $post_url . '#' . $post_meta[0]['form_id'];
                
                $actions['preview_form'] = '<a target="__blank" href="'. $form_specific_post_url .'">Preview Form</a>';

                return $actions;

            }

            return $actions;

        } , 10 , 2);
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
        $post_meta = $entry['post_meta'];

        $entry = apply_filters( self::text_domain , wp_parse_args( $entry, $defaults ) );
        $form_label = trim($post_meta['title']) === "" ? $post_meta['form_id'] : $post_meta['title'];

        $new_entry = new self();

        $new_entry->email = $entry['email'];
        $new_entry->template = $entry['template'];
        $new_entry->fields = $entry['fields'];
        $new_entry->form_id = $post_meta['form_id'];


        $current_post = get_post( get_the_ID() );


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


        // inserting this submission into entries cpt

        $new_post = array(
            'post_title' => $form_label,
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
            $form_id_meta_key = "form_id__" . self::post_type;

            update_post_meta( $post_id, $template_meta_key, $new_entry->template );
            update_post_meta( $post_id, $fields_meta_key, $new_entry->fields );
            update_post_meta( $post_id, $extra_meta_key, $new_entry->extra );
            update_post_meta( $post_id, $form_id_meta_key, $new_entry->form_id );

        }

    }

    public static function create_entry( $template, $subject , $body , $fields, $attachments = NULL ) {



        $new_entry = array();


        $new_entry['template'] = array(
            'subject' => $subject,
            'body'    => $body
        );

        $new_entry['fields'] = array();
        $new_entry['post_meta'] = array(
            'title' => '',
            'form_id' => ''
        );

        foreach ( $fields as $field_key => $field_value ) {

            $is_hidden_field = Validator::is_hidden_data_field( $field_value['field_id'] );


            if ($field_value['field_type'] === 'file_upload') {

                $parse_entry = get_value_and_name($field_value);

                $upload_dir_base = wp_get_upload_dir()['baseurl'];
                $filename = $upload_dir_base . '/gutenberg-forms-uploads/' . $field_value['file_name']; 

                $new_entry['fields'][ $parse_entry['admin_id'] ] = $filename;

            } else if ( $is_hidden_field ) {

                

                if ($field_value['field_id'] === 'gf_form_label') {
                
                    $new_entry['post_meta']['title'] = $field_value['field_value'];
                
                } else if ($field_value['field_id'] === 'gf_form_id') {

                    $new_entry['post_meta']['form_id'] = $field_value['field_value'];

                }


            } else if (!$is_hidden_field) {
                $parse_entry = get_value_and_name($field_value);
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