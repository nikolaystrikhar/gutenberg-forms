<?php


require_once plugin_dir_path(__DIR__) . 'triggers/functions.php';
require_once plugin_dir_path(__DIR__) . 'export/index.php';

$path = preg_replace('/wp-content(?!.*wp-content).*/', '', __DIR__);
include($path . 'wp-load.php');
require_once(ABSPATH . 'wp-admin/includes/plugin-install.php');
require_once(ABSPATH . 'wp-admin/includes/file.php');
require_once(ABSPATH . 'wp-admin/includes/misc.php');
require_once(ABSPATH . 'wp-admin/includes/plugin.php');
require_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');

class Dashboard
{

    const page_title = 'Dashboard';
    const capability = 'manage_options';
    const slug = 'gutenberg_forms';
    const settings_group = "gutenberg_forms_setting";

    public function __construct()
    {
        $this->on_initialized();

        add_action('admin_menu', array($this, 'register'));
        add_action('wp_ajax_cwp_gf_install_plugin', array($this, 'install_plugin')); // install plugin ajax


        // services..

        $this->informations = array(
            'cards' => array(
                array(
                    'title' => 'Want to Contribute?',
                    'media' => array(
                        'type' => 'svg',
                        'src' => '<svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="90px" height="90px">    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"/></svg>'
                    ),
                    'action'    => array(
                        'link' => 'https://github.com/munirkamal/gutenberg-forms',
                        'label' => 'Get Connected On Github'
                    )
                ),
                array(
                    'title' => 'Found A Bug?',
                    'action'    => array(
                        'link' => 'https://wordpress.org/support/plugin/forms-gutenberg/',
                        'label' => 'Visit Support Forum'
                    ),
                    'media' => array(
                        'type' => 'svg',
                        'src' => '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g>
                           <path d="M497.229,260.925h-88.615v-30.708c44.584-7.102,78.769-45.816,78.769-92.368v-19.692c0-8.156-6.613-14.769-14.769-14.769
                               s-14.769,6.613-14.769,14.769v19.692c0,30.206-21.04,55.573-49.23,62.261v-13.03c0-13.573-11.042-24.615-24.615-24.615H369.23
                               v-54.153c0-31.066-22.254-57.024-51.656-62.793l10.998-24.746c3.313-7.453-0.044-16.182-7.498-19.494
                               c-7.455-3.314-16.182,0.044-19.494,7.498l-15.794,35.536h-59.573L210.42,8.775c-3.312-7.453-12.041-10.811-19.494-7.498
                               c-7.453,3.312-10.81,12.041-7.498,19.494l10.998,24.746c-29.401,5.77-51.655,31.726-51.655,62.793v54.153h-14.769
                               c-13.573,0-24.615,11.042-24.615,24.615v13.03c-28.19-6.687-49.23-32.055-49.23-62.261v-19.692
                               c0-8.156-6.613-14.769-14.769-14.769s-14.769,6.613-14.769,14.769v19.692c0,46.552,34.185,85.265,78.769,92.368v30.708H14.771
                               c-8.156,0-14.769,6.613-14.769,14.769s6.613,14.769,14.769,14.769h88.615v30.708c-44.584,7.102-78.769,45.816-78.769,92.368
                               v19.692c0,8.156,6.613,14.769,14.769,14.769s14.769-6.613,14.769-14.769v-19.692c0-30.206,21.04-55.573,49.23-62.261v8.107
                               C103.386,443.537,171.849,512,256,512s152.614-68.463,152.614-152.614v-8.107c28.19,6.688,49.23,32.055,49.23,62.261v19.692
                               c0,8.156,6.613,14.769,14.769,14.769s14.769-6.613,14.769-14.769v-19.692c0-46.552-34.185-85.265-78.769-92.368v-30.708h88.615
                               c8.156,0,14.769-6.613,14.769-14.769S505.385,260.925,497.229,260.925z M172.308,108.311c0-19.002,15.459-34.461,34.461-34.461
                               h98.461c19.002,0,34.461,15.459,34.461,34.461v54.153H172.308V108.311z M379.076,359.386c0,67.864-55.212,123.076-123.076,123.076
                               S132.924,427.25,132.924,359.386V192.003h108.307v142.768c0,8.156,6.613,14.769,14.769,14.769s14.769-6.613,14.769-14.769V192.003
                               h108.307V359.386z"/>
                       </g>
                   </svg>',
                    ),
                ),
                array(
                    'title' => 'Like the plugin?',
                    'action'    => array(
                        'link' => 'https://wordpress.org/support/plugin/forms-gutenberg/reviews/#new-post',
                        'label' => 'Leave A Review'
                    ),
                    'media' => array(
                        'type' => 'svg',
                        'src' => '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 511.999 511.999" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve">
                   <path style="fill:#FFDC64;" d="M452.71,157.937l-133.741-12.404L265.843,22.17c-3.72-8.638-15.967-8.638-19.686,0l-53.126,123.362
                       L59.29,157.937c-9.365,0.868-13.149,12.516-6.084,18.723l100.908,88.646l-29.531,131.029c-2.068,9.175,7.841,16.373,15.927,11.572
                       L256,339.331l115.49,68.576c8.087,4.802,17.994-2.397,15.927-11.572l-29.532-131.029l100.909-88.646
                       C465.859,170.453,462.074,158.805,452.71,157.937z"/>
                   <g>
                       <path style="fill:#FFF082;" d="M119.278,17.923c6.818,9.47,26.062,50.14,37.064,73.842c1.73,3.726-2.945,7.092-5.93,4.269
                           C131.425,78.082,98.96,46.93,92.142,37.459c-5.395-7.493-3.694-17.941,3.8-23.336C103.435,8.728,113.883,10.43,119.278,17.923z"/>
                       <path style="fill:#FFF082;" d="M392.722,17.923c-6.818,9.47-26.062,50.14-37.064,73.842c-1.73,3.726,2.945,7.092,5.93,4.269
                           c18.987-17.952,51.451-49.105,58.27-58.575c5.395-7.493,3.694-17.941-3.8-23.336C408.565,8.728,398.117,10.43,392.722,17.923z"/>
                       <path style="fill:#FFF082;" d="M500.461,295.629c-11.094-3.618-55.689-9.595-81.612-12.875c-4.075-0.516-5.861,4.961-2.266,6.947
                           c22.873,12.635,62.416,34.099,73.51,37.717c8.778,2.863,18.215-1.932,21.078-10.711
                           C514.034,307.928,509.239,298.492,500.461,295.629z"/>
                       <path style="fill:#FFF082;" d="M11.539,295.629c11.094-3.618,55.689-9.595,81.612-12.875c4.075-0.516,5.861,4.961,2.266,6.947
                           c-22.873,12.635-62.416,34.099-73.51,37.717c-8.778,2.863-18.215-1.932-21.078-10.711S2.761,298.492,11.539,295.629z"/>
                       <path style="fill:#FFF082;" d="M239.794,484.31c0-11.669,8.145-55.919,13.065-81.582c0.773-4.034,6.534-4.034,7.307,0
                           c4.92,25.663,13.065,69.913,13.065,81.582c0,9.233-7.485,16.718-16.718,16.718C247.279,501.029,239.794,493.543,239.794,484.31z"/>
                   </g>
                   <path style="fill:#FFC850;" d="M285.161,67.03l-19.319-44.86c-3.72-8.638-15.967-8.638-19.686,0L193.03,145.532L59.29,157.937
                       c-9.365,0.868-13.149,12.516-6.084,18.723l100.908,88.646l-29.531,131.029c-2.068,9.175,7.841,16.373,15.927,11.572l15.371-9.127
                       C181.08,235.66,251.922,115.918,285.161,67.03z"/>
                   <g>
                   </g>
                   </svg>',
                    ),
                ),

                array(
                    'title' => 'How to use?',
                    'action'    => array(
                        'link' => 'http://docs.gutenbergforms.com/',
                        'label' => 'Read Docs'
                    ),
                    'media' => array(
                        'type' => 'svg',
                        'src' => '<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m258.287 34.2h127.279v193.747h-127.279z" fill="#80aef8" transform="matrix(.707 -.707 .707 .707 1.607 266.027)"/><path d="m453 197c0-33.137-26.863-60-60-60h-77v-77c0-33.137-26.863-60-60-60l-110 256 110 256h197z" fill="#4175df"/><path d="m59 0h197v512h-197z" fill="#4086f4"/><path d="m310.5 407h-54.5l-20 15 20 15h54.5z" fill="#e3e7ea"/><path d="m134 407h122v30h-122z" fill="#fff"/><path d="m378 347h-122l-20 15 20 15h122z" fill="#e3e7ea"/><path d="m134 347h122v30h-122z" fill="#fff"/><path d="m378 287h-122l-20 15 20 15h122z" fill="#e3e7ea"/><path d="m134 287h122v30h-122z" fill="#fff"/><path d="m378 227h-122l-20 15 20 15h122z" fill="#e3e7ea"/><path d="m134 227h122v30h-122z" fill="#fff"/></g></svg>',
                    ),
                ),

            )
        );


        $total_forms = wp_count_posts('cwp_gf_forms')->publish;
        $total_entries = wp_count_posts('cwp_gf_entries')->publish;

        if ($total_entries !== 0) {
            $this->informations['cards'][] =  array(
                'title' => 'Total Form Entries',
                'media' => array(
                    'type' => 'counter',
                    'src'  => $total_entries,
                ),
                'action' => array(
                    'label' => 'View Entries',
                    'link' => get_bloginfo('url') . '/wp-admin/admin.php?page=gutenberg_forms#/entries'
                )
            );
        }


        if ($total_forms !== 0) {
            $this->informations['cards'][] = array(
                'title' => 'Total Saved Forms',
                'media' => array(
                    'type' => 'counter',
                    'src'  => $total_forms,
                ),
                'action' => array(
                    'label' => 'View Forms',
                    'link' =>  get_bloginfo('url') . '/wp-admin/edit.php?post_type=cwp_gf_forms'
                )
            );
        }

        $this->settings = array(
            'integrations' => array(
                'recaptcha' => array(
                    'title' => 'ReCaptcha v2',
                    'is_pro'  => false,
                    'type'  => 'spamProtection',
                    'guide' => $this->get_guide_content('recaptcha'),
                    'description' => '<a href="https://www.google.com/recaptcha/intro/v3.html" target="__blank">reCAPTCHA</a> protects you against spam and other types of automated abuse. With Gutenberg Form’s reCAPTCHA integration, you can block abusive form submissions by spam bots.',
                    'banner' => 'data:image/png;base64,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YWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMC44MCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpwZGY9J2h0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8nPgogIDxwZGY6QXV0aG9yPkFuZHJvaWQgR2FtaW5nIEZBUXM8L3BkZjpBdXRob3I+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcD0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyc+CiAgPHhtcDpDcmVhdG9yVG9vbD5DYW52YTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9J3InPz4xxIl7AAAAAElFTkSuQmCC',
                    'fields' => array(
                        'site_key' =>  array(
                            'label' => 'Site Key',
                            'default' => '',
                            'type' => 'string',
                        ),
                        'client_secret' => array(
                            'label' => 'Client Secret',
                            'default' => '',
                            'type' => 'string'
                        )
                    ),
                ),
            )
        );

        $this->settings['integrations'] = apply_filters('gutenberg_forms_integrations', $this->settings['integrations']);
    }

    public function on_initialized()
    {

        $activate_plugin_key = 'cwp-activate-plugin-script';

        if (array_key_exists($activate_plugin_key, $_POST)) {

            $plugin_script = $_POST[$activate_plugin_key];

            $this->plugin_activation($plugin_script); // activating the plugin

        }

        $this->handle_exports();
    }

    public function handle_exports()
    {

        $is_export_request = isset($_POST['cwp-gutenberg_forms_entries-export-form-id']) and isset($_POST['cwp-gutenberg_forms_entries-export-format']);

        if ($is_export_request) {

            $export_form_id = $_POST['cwp-gutenberg_forms_entries-export-form-id'];
            $export_format = $_POST['cwp-gutenberg_forms_entries-export-format'];

            $args = [];

            $args['meta_query'] = [
                [
                    'key' => 'form_id__cwp_gf_entries',
                    'value' => $export_form_id,
                    'compare' => '='
                ]
            ];
            cwp_gf_Entries_export_handler::export($export_format, $args);
        }
    }

    public function plugin_activation($plugin)
    {


        $plugin_script = "";
        foreach (get_plugins() as $key => $plugin_data) {

            if (array_key_exists('TextDomain', $plugin_data) and $plugin_data['TextDomain'] === $plugin) {
                $plugin_script = $key; # plugin script
            }
        }

        if (!function_exists('activate_plugin')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        if (!is_plugin_active($plugin_script)) {
            activate_plugin($plugin_script);
        }
    }

    public function install_plugin()
    {
        if (!current_user_can('install_plugins'))
            wp_die(__('Sorry, you are not allowed to install plugins on this site.', 'framework'));

        $plugin = $_POST["plugin"];


        // Include required libs for installation
        require_once(ABSPATH . 'wp-admin/includes/plugin-install.php');
        require_once(ABSPATH . 'wp-admin/includes/class-wp-upgrader.php');
        require_once(ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php');
        require_once(ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php');

        // Get Plugin Info
        $api = plugins_api(
            'plugin_information',
            array(
                'slug' => $plugin,
                'fields' => array(
                    'short_description' => false,
                    'sections' => false,
                    'requires' => false,
                    'rating' => false,
                    'ratings' => false,
                    'downloaded' => false,
                    'last_updated' => false,
                    'added' => false,
                    'tags' => false,
                    'compatibility' => false,
                    'homepage' => false,
                    'donate_link' => false,
                ),
            )
        );

        $skin     = new WP_Ajax_Upgrader_Skin();
        $upgrader = new Plugin_Upgrader($skin);
        $upgrader->install($api->download_link);

        if ($api->name) {
            $status = 'success';
            $msg = $api->name . ' successfully installed.';
        } else {
            $status = 'failed';
            $msg = 'There was an error installing ' . $api->name . '.';
        }

        $json = array(
            'status' => $status,
            'msg' => $msg,
        );

        wp_send_json($json);
    }

    public function get_guide_content($integration)
    {
        $guide = plugin_dir_path(__DIR__) . 'integrations/' . $integration . '/guide/guide.html';

        return file_get_contents($guide);
    }

    public function register_settings()
    {


        $general_settings = array(
            'messages' => array(
                'spam'  => array(
                    'label' => 'Spam',
                    'value' => 'There was an error trying to send your message. Please try again later.',
                ),
                'error'  => array(
                    'label' => 'Error',
                    'value' => 'There was an error trying to send your message. Please try again later.',
                ),
                'name' => array(
                    'label' => 'Name',
                    'value' => 'The name {{value}} is not valid!'
                ),
                'email' => array(
                    'label' => 'Email',
                    'value' => 'The email {{value}} is not valid!'
                ),
                'text' => array(
                    'label' => 'Text',
                    'value' => 'The text {{value}} is not valid!'
                ),
                'message' => array(
                    'label' => 'Message',
                    'value' => 'The message {{value}} is not valid!'
                ),
                'phone' => array(
                    'label' => 'Phone',
                    'value' => 'The phone {{value}} is not valid!'
                ),
                'website' => array(
                    'label' => 'Website',
                    'value' => 'The website {{value}} is not valid!'
                ),
                'number' => array(
                    'label' => 'Number',
                    'value' => 'The number {{value}} is not in range!'
                ),
                'file-upload'  => array(
                    'label' => 'File Upload',
                    'value' => 'The file {{value}} is not valid!'
                )

            )
        );

        register_setting(
            self::settings_group,
            'cwp_gutenberg_forms_general_settings',
            array(
                'type' => 'string',
                'show_in_rest' => true,
                'default' => json_encode($general_settings, JSON_PRETTY_PRINT)
            )
        );

        $saved_general_settings = get_option('cwp_gutenberg_forms_general_settings');
        $new_messages = array();


        if (array_key_exists('messages', json_decode($saved_general_settings, true))) {


            # merging updated message
            $new_messages = array_merge($general_settings['messages'], json_decode($saved_general_settings, true)['messages']);
        }

        $new_general_settings = array();

        $new_general_settings['messages'] = $new_messages;
        $new_general_settings_json = json_encode($new_general_settings, JSON_PRETTY_PRINT);


        update_option('cwp_gutenberg_forms_general_settings', $new_general_settings_json);

        $this->general = $new_general_settings_json;

        foreach ($this->settings['integrations'] as $integration => $details) {

            $enable_integration = "cwp__enable__" . $integration;

            register_setting(
                self::settings_group,
                $enable_integration,
                array(
                    'type'         => 'boolean',
                    'show_in_rest' => true,
                    'default'      => false,
                )
            );

            $is_enabled =  get_option($enable_integration) === "1" ? true : false;

            if (
                array_key_exists('is_disabled', $details)  and
                $details['is_disabled']  === true
            ) {
                update_option($enable_integration, false);
                // disabling the integration if it is disabled and has errors
            }

            $this->settings['integrations'][$integration]['enable'] = $is_enabled;


            foreach ($details['fields'] as $field => $initialValue) {

                $field_group = "cwp__" . $integration  . '__' . $field;

                register_setting(
                    self::settings_group,
                    $field_group,
                    array(
                        'type'         => $initialValue['type'],
                        'show_in_rest' => true,
                        'default'      =>  $initialValue['default'],
                    )
                );

                //SETTING CURRENT_VALUE
                $this->settings['integrations'][$integration]['fields'][$field]['value'] = get_option($field_group);
            }
        }
    }

    public function register()
    {

        //assets 

        //currently embedding dashboard after creating in another plugin due to conflicts of our script with webpack

        add_action('admin_enqueue_scripts', function ($suffix) {


            if ($suffix === 'toplevel_page_gutenberg_forms') {

                // for testing purpose...

                $production = false;

                if ($production) {

                    $js = "http://gutenberg-forms-latest.local/wp-content/plugins/gutenberghub-dashboard/build/build.js";
                    $css = "http://gutenberg-forms-latest.local/wp-content/plugins/gutenberghub-dashboard/build/build.css";
                    wp_enqueue_script('cwp_gf_dashboard_script', $js, array('wp-api', 'wp-i18n', 'wp-components', 'wp-element'), uniqid(), true);
                    wp_enqueue_style('cwp_gf_dashboard_style', $css, array('wp-components'), uniqid());
                } else {
                    wp_enqueue_script('cwp_gf_dashboard_script', plugins_url('/', __DIR__) . '/dist/dashboard/build.js', array('wp-api', 'wp-i18n', 'wp-components', 'wp-element'), 'latest', true);
                    wp_enqueue_style('cwp_gf_dashboard_style', plugins_url('/', __DIR__) . '/dist/dashboard/build.css', array('wp-components'), 'latest');
                }
            }

            wp_localize_script(
                'cwp_gf_dashboard_script',
                'cwp_global',
                [
                    'settings'          => $this->settings,
                    'informations'      => $this->informations,
                    'general'           => json_decode($this->general, JSON_PRETTY_PRINT),
                    'installed_plugins' => get_all_plugins_data(),
                    'ajax_url'          => admin_url('admin-ajax.php'),
                    'rest_url'          => get_rest_url()
                ]
            );
        });

        add_menu_page(
            self::page_title,
            'Gutenberg Forms',
            self::capability,
            self::slug,
            array($this, 'page_content'),
            'dashicons-feedback',
            25
        );


        add_submenu_page(self::slug, 'Form', 'Forms', 'manage_options',  'edit.php?post_type=cwp_gf_forms');
        add_submenu_page(self::slug, 'Entry', 'Entries', 'manage_options', 'admin.php?page=gutenberg_forms#/entries');
    }

    public function page_content()
    {
?>
        <div id="cwp-gutenberg-forms-dashboard-root"></div>
<?php
    }
}
