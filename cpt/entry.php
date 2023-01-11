<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __DIR__ ) . 'triggers/functions.php';
require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';

function get_value_and_name( $field ) {
    $value   = $field['field_value'];
    $adminId = $field['decoded_entry']['admin_id'] ?? null; // TODO: check later.

    $result = array();

    $result['value']    = $value;
    $result['admin_id'] = $adminId;

    return $result;
}

class Entries {
    const text_domain = "cwp-gutenberg-forms";

    const post_type = "cwp_gf_entries";

    public static function register_post_type(): void {
        register_post_type(
            self::post_type,
            array(
                'labels'             => array(
                    'name'                  => __( 'Entries', 'gutenberg-forms' ),
                    'singular_name'         => __( 'Entry', 'gutenberg-forms' ),
                    'menu_name'             => __( 'Entries', 'gutenberg-forms' ),
                    'name_admin_bar'        => __( 'Entries', 'gutenberg-forms' ),
                    'archives'              => __( 'Entries Archives', 'gutenberg-forms' ),
                    'attributes'            => __( 'Entries Attributes', 'gutenberg-forms' ),
                    'parent_item_colon'     => __( 'Entries:', 'gutenberg-forms' ),
                    'all_items'             => __( 'All Entries', 'gutenberg-forms' ),
                    'add_new_item'          => __( 'Add New Entry', 'gutenberg-forms' ),
                    'add_new'               => __( 'Add Entry', 'gutenberg-forms' ),
                    'new_item'              => __( 'New Entry', 'gutenberg-forms' ),
                    'edit_item'             => __( 'View Entry', 'gutenberg-forms' ),
                    'update_item'           => __( 'Update Entry', 'gutenberg-forms' ),
                    'view_item'             => __( 'View Entry', 'gutenberg-forms' ),
                    'view_items'            => __( 'View Entries', 'gutenberg-forms' ),
                    'search_items'          => __( "Search Entry", 'gutenberg-forms' ),
                    'not_found'             => __( 'Entry Not found', 'gutenberg-forms' ),
                    'not_found_in_trash'    => __( 'Entry Not found in Trash', 'gutenberg-forms' ),
                    'featured_image'        => __( 'Featured Image', 'gutenberg-forms' ),
                    'set_featured_image'    => __( 'Set featured image', 'gutenberg-forms' ),
                    'remove_featured_image' => __( 'Remove featured image', 'gutenberg-forms' ),
                    'use_featured_image'    => __( 'Use as featured image', 'gutenberg-forms' ),
                    'insert_into_item'      => __( 'Insert into entry', 'gutenberg-forms' ),
                    'uploaded_to_this_item' => __( 'Uploaded to this entry', 'gutenberg-forms' ),
                    'items_list'            => __( 'Entries list', 'gutenberg-forms' ),
                    'items_list_navigation' => __( 'Entries list navigation', 'gutenberg-forms' ),
                    'filter_items_list'     => __( 'Filter entries list', 'gutenberg-forms' ),
                ),
                'content'            => false,
                'menu_icon'          => 'dashicons-list-view',
                'description'        => __( 'For storing entries', 'gutenberg-forms' ),
                'public'             => true,
                'publicly_queryable' => false,
                'show_in_menu'       => false,
                'query_var'          => false,
                'rewrite'            => false,
                'capability_type'    => 'post',
                'capabilities'       => array(
                    'create_posts' => false,
                ),
                'map_meta_cap'       => true,
                'has_archive'        => false,
                'hierarchical'       => false,
                'menu_position'      => null,
                'supports'           => false,
            )
        );

        add_filter(
            'manage_' . self::post_type . '_posts_columns',
            function ( array $columns ): array {
                $date_title = $columns['date'];
                unset( $columns['date'] );

                $columns['status'] = __( 'Status', 'forms-gutenberg' );
                $columns['date']   = $date_title;

                return $columns;
            }
        );

        add_action(
            'manage_' . self::post_type . '_posts_custom_column',
            function ( string $column, int $post_id ): void {
                if ( $column == 'status' ) {
                    $status = get_post_meta( $post_id, 'status__cwp_gf_entries', true );

                    if ( $status === 'read' ) {
                        _e( 'Read', 'forms-gutenberg' );
                    } elseif ( $status === 'unread' ) {
                        _e( 'Unread', 'forms-gutenberg' );
                    }
                }
            },
            10,
            2
        );

        add_filter(
            'post_row_actions',
            function ( array $actions, WP_Post $post ): array {
                if ( ! isset( $_GET['post_type'] ) || $_GET['post_type'] !== self::post_type ) {
                    return $actions;
                }

                $trash = $actions['trash'];
                unset( $actions['trash'] );

                $actions['view'] = sprintf(
                    '<a href="%s">%s</a>',
                    esc_url( get_edit_post_link( $post ) ),
                    __( 'View', 'forms-gutenberg' )
                );

                $actions['toggle_status'] = sprintf(
                    '<a href="%s">%s</a>',
                    esc_url(
                        add_query_arg(
                            array(
                                'post_id'  => $post->ID,
                                'action'   => 'gutenberg_forms_toggle_status',
                                '_wpnonce' => wp_create_nonce( 'gutenberg_forms_toggle_status' ),
                            ),
                            admin_url( 'post.php' )
                        )
                    ),
                    __( 'Toggle Status', 'forms-gutenberg' )
                );

                $actions['trash'] = $trash;

                unset( $actions['edit'] );
                unset( $actions['inline hide-if-no-js'] );

                return $actions;
            },
            10,
            2
        );

        add_action(
            'admin_init',
            function (): void {
                if (
                    isset( $_REQUEST['action'] )
                    && 'gutenberg_forms_toggle_status' === sanitize_key( wp_unslash( $_REQUEST['action'] ) )
                    && wp_verify_nonce( $_REQUEST['_wpnonce'], 'gutenberg_forms_toggle_status' )
                ) {
                    $post_id = intval( wp_unslash( $_GET['post_id'] ) );

                    if ( $post_id <= 0 ) {
                        return;
                    }

                    $status = get_post_meta( $post_id, 'status__' . self::post_type, true );

                    $status = $status === 'read' ? 'unread' : 'read';

                    update_post_meta( $post_id, 'status__' . self::post_type, $status );

                    wp_safe_redirect( admin_url( 'edit.php?post_type=' . self::post_type ) );
                    exit;
                }
            }
        );

        add_filter(
            'get_user_option_screen_layout_' . self::post_type,
            function (): int {
                return 1;
            }
        );

        add_action(
            'edit_form_top',
            function ( WP_Post $post ) {
                echo 1;
            }
        );

        add_action(
            'add_meta_boxes',
            function ( string $post_type ) {
                remove_meta_box( 'submitdiv', self::post_type, 'side' );

                if ( self::post_type === $post_type ) {
                    add_meta_box(
                        'gutenberg_forms_entry_fields',
                        __( 'Fields', 'forms-gutenberg' ),
                        function ( WP_Post $post ) {
                            $fields = get_post_meta( $post->ID, 'fields__' . self::post_type, true );

                            if ( ! empty( $fields ) ) {
                                foreach ( $fields as $name => $value ) {
                                    ?>
                                    <p>
                                        <strong><?php echo esc_html( $name ); ?></strong>
                                        <br/>
                                        <?php echo esc_html( $value ); ?>
                                    </p>
                                    <?php
                                }
                            }
                        },
                        $post_type,
                        'advanced',
                        'high'
                    );

                    add_meta_box(
                        'gutenberg_forms_entry_email_template',
                        __( 'Email Template', 'forms-gutenberg' ),
                        function ( WP_Post $post ) {
                            $fields = get_post_meta( $post->ID, 'template__' . self::post_type, true );

                            if ( ! empty( $fields ) ) {
                                foreach ( $fields as $name => $value ) {
                                    ?>
                                    <p>
                                        <strong><?php echo esc_html( $name ); ?></strong>
                                        <br/>
                                        <?php echo esc_html( $value ); ?>
                                    </p>
                                    <?php
                                }
                            }
                        },
                        $post_type,
                        'advanced',
                        'high'
                    );

                    add_meta_box(
                        'gutenberg_forms_entry_additional_data',
                        __( 'Additional Information', 'forms-gutenberg' ),
                        function ( WP_Post $post ) {
                            $fields = get_post_meta( $post->ID, 'extra__' . self::post_type, true );

                            if ( ! empty( $fields ) ) {
                                foreach ( $fields as $name => $value ) {
                                    ?>
                                    <p>
                                        <strong><?php echo esc_html( $name ); ?></strong>
                                        <br/>
                                        <?php echo esc_html( $value ); ?>
                                    </p>
                                    <?php
                                }
                            }
                        },
                        $post_type,
                        'advanced',
                        'high'
                    );
                }
            }
        );
    }

    public static function post( $entry = '' ) {
        // some default arguments for creating a new entry
        $defaults  = array(
            'email'    => '',
            'to'       => '',
            'template' => array(
                'subject' => '',
                'body'    => '',
            ),
            'fields'   => array(),
        );
        $post_meta = $entry['post_meta'];

        $entry      = wp_parse_args( $entry, $defaults );
        $form_label = trim( $post_meta['title'] ) === "" ? $post_meta['form_id'] : $post_meta['title'];

        $new_entry = new self();

        $new_entry->email       = $entry['email'];
        $new_entry->template    = $entry['template'];
        $new_entry->fields      = $entry['fields'];
        $new_entry->form_id     = $post_meta['form_id'];
        $new_entry->field_types = [];

        if ( array_key_exists( 'field_types', $entry ) ) :
            $new_entry->field_types = $entry['field_types'];
        endif;

        $current_post = get_post( get_the_ID() );

        $new_entry->extra = array(
            'url'              => get_page_link(),
            'remote_ip'        => $_SERVER['REMOTE_ADDR'],
            'user_agent'       => $_SERVER['HTTP_USER_AGENT'],
            'form_id'          => $post_meta['form_id'],
            'form_label'       => $form_label,
            'date'             => date( "Y/m/d" ),
            'day'              => date( "l" ),
            'time'             => date( "h:i:sa" ),
            'post_id'          => get_the_ID(),
            'post_title'       => $current_post->post_title,
            'post_author'      => $current_post->post_author,
            'site_title'       => get_bloginfo( 'name' ),
            'site_description' => get_bloginfo( 'description' ),
            'site_url'         => get_bloginfo( 'url' ),
            'site_admin_email' => get_bloginfo( 'admin_email' ),
        );

        $new_entry->status = 'unread';
        $new_entry->notes  = json_encode( [], JSON_PRETTY_PRINT );

        // inserting this submission into entries cpt

        $new_post = array(
            'post_title'  => $form_label,
            'post_status' => 'publish',
            'post_type'   => self::post_type,
        );

        $post_id = wp_insert_post( $new_post );

        if ( $post_id ) {
            // if the post has been created in the cpt
            // then updating the post meta in the cpt

            // updating template meta
            $template_meta_key    = "template__" . self::post_type;
            $fields_meta_key      = "fields__" . self::post_type;
            $extra_meta_key       = "extra__" . self::post_type;
            $form_id_meta_key     = "form_id__" . self::post_type;
            $status_meta_key      = "status__" . self::post_type;
            $notes_meta_key       = "notes__" . self::post_type;
            $field_types_meta_key = "field_types__" . self::post_type;

            update_post_meta( $post_id, $template_meta_key, $new_entry->template );
            update_post_meta( $post_id, $fields_meta_key, $new_entry->fields );
            update_post_meta( $post_id, $extra_meta_key, $new_entry->extra );
            update_post_meta( $post_id, $form_id_meta_key, $new_entry->form_id );
            update_post_meta( $post_id, $status_meta_key, $new_entry->status );
            update_post_meta( $post_id, $notes_meta_key, $new_entry->notes );
            update_post_meta( $post_id, $field_types_meta_key, $new_entry->field_types );
        }
    }

    public static function create( $template, $subject, $body, $fields, $attachments = null ) {
        $new_entry = array();

        $new_entry['template'] = array(
            'subject' => $subject,
            'body'    => $body,
        );

        $new_entry['fields']      = array();
        $new_entry['field_types'] = array();

        $new_entry['post_meta'] = array(
            'title'     => '',
            'form_id'   => '',
            'post_id'   => get_the_ID(),
            'site_url'  => get_bloginfo( 'url' ),
            'admin_url' => admin_url( 'admin.php?page=gutenberg_forms' ),
        );

        $new_entry['extended_data']   = $template['extendedData'];
        $new_entry['extended_fields'] = $fields;

        foreach ( $fields as $field_value ) {
            $is_hidden_field    = Validator::is_hidden_data_field( $field_value['field_id'] );
            $is_recaptcha_field = $field_value['field_id'] === 'g-recaptcha-response';
            $parse_entry        = get_value_and_name( $field_value );
            $field_admin_id     = $parse_entry['admin_id'];
            $field_type         = $field_value['field_type'];

            $new_entry['field_types'][ $field_admin_id ] = $field_type;

            if ( $field_value['field_type'] === 'file_upload' and ! $is_recaptcha_field ) {
                $parse_entry = get_value_and_name( $field_value );

                $upload_dir_base = wp_get_upload_dir()['baseurl'];
                $filename        = $upload_dir_base . '/gutenberg-forms-uploads/' . $field_value['file_name'];

                $new_entry['fields'][ $parse_entry['admin_id'] ] = $filename;
            } elseif ( $is_hidden_field and ! $is_recaptcha_field ) {
                if ( $field_value['field_id'] === 'gf_form_label' ) {
                    $new_entry['post_meta']['title'] = $field_value['field_value'];
                } elseif ( $field_value['field_id'] === 'gf_form_id' ) {
                    $new_entry['post_meta']['form_id'] = $field_value['field_value'];
                }
            } elseif ( ! $is_hidden_field and ! $is_recaptcha_field ) {
                $parse_entry                                     = get_value_and_name( $field_value );
                $new_entry['fields'][ $parse_entry['admin_id'] ] = $parse_entry['value'];
            }
        }

        if ( array_key_exists( 'integrations', $template ) ) {
            $new_entry['integrations'] = $template['integrations'];
        }

        if ( array_key_exists( 'email', $template ) ) {
            // this means the email is provided
            $new_entry['email'] = $template['email'];
        } else {
            // this means that the email will be sent to the admin email so,
            $new_entry['email'] = get_bloginfo( 'admin_email' );
        }

        if ( ! is_null( $attachments ) ) {
            $new_entry['attachments'] = $attachments;
        }

        return $new_entry;
    }
}
