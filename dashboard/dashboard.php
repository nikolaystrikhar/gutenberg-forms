<?php

require_once plugin_dir_path( __DIR__ ) . 'integrations/mailchimp/api.php';

class Dashboard {

    const parent_slug = 'gutenberg_forms';
    const page_title = 'Dashboard';
    const capability = 'manage_options';
    const slug = 'gutenberg_forms_dashboard';
    const settings_group = "gutenberg_forms_setting";

    // const MailChimp = new MailChimp(); 

    public function __construct() {
        
        add_action( 'admin_menu', array( $this, 'register' ) );

        //services..
        $this->mail_chimp = new MailChimp();

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
                        'link' => 'https://wordpress.org/support/plugin/forms-gutenberg/reviews/#new-post',
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
                'link' => get_bloginfo('url') . '/wp-admin/edit.php?post_type=cwp_gf_entries'
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
                'mailchimp' => array(
                    'title' => 'Mail Chimp',
                    'is_pro'  => true,
                    'type'  => 'autoResponder',
                    'guide' => $this->get_guide_content( 'mailchimp'  ),
                    'description' => 'Bring new life to your lists with upgraded Mailchimp signup forms for WordPress! Easy to build and customize with no code required. Link to lists and interest groups!',
                    'banner' => 'https://us20.admin.mailchimp.com/release/1.1.132c826603d26483f97297c92082b7e461f3c8cb4/images/brand_assets/logos/mc-freddie-dark.svg',
                    'fields' => array(
                        'api_key' =>  array(
                            'label' => 'Api Key',
                            'default' => '',
                            'type' => 'string',
                        )
                    ),
                    'query_fields' => array(
                        'list' => array(
                            'label' => 'Select List',
                            'value' => $this->mail_chimp->get_lists(),
                            'type'  => 'select'
                        ),
                        'tags' => array(
                            'label' => 'Tags',
                            'type'  => 'tags',
                            'value' => []
                        )
                    ),
                    'api_fields' => array(
                        'EMAIL' => array(
                            'label' => 'Email'
                        ),
                        'FNAME' => array(
                            'label' => 'First Name'
                        ),
                        'LNAME' => array(
                            'label' => 'Last Name'
                        ),
                        'PHONE' => array(
                            'label' => 'Phone'
                        ),
                        'ADDRESS_1' => array(
                            'label' => 'Address 1'
                        ),
                        'STATE' => array(
                            'label' => 'State'
                        ),
                        'ZIP' => array(
                            'label' => 'Zip Code'
                        ),
                        'COUNTRY' => array(
                            'label' => 'Country'
                        ),
                        'CITY'  => array(
                            'label' => 'City'
                        )
                    )
                ),
                'recaptcha' => array(
                    'title' => 'ReCaptcha v2',
                    'is_pro'  => false,
                    'type'  => 'spamProtection',
                    'guide' => $this->get_guide_content( 'recaptcha'  ),
                    'description' => 'reCAPTCHA requires a Site and Private API key. Sign up for a <a href="https://www.google.com/recaptcha/intro/v3.html" target="__blank">free reCAPTCHA key</a>.',
                    'banner' => 'https://expresswriters.com/wp-content/uploads/2015/09/google-new-logo-1030x541.jpg',
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
                )
             )
        );


    }

    public function get_guide_content( $integration ) {
        $guide = plugin_dir_path( __DIR__ ) . 'integrations/'. $integration .'/guide/guide.html';

        return file_get_contents( $guide  );
    }

    public function register_settings() {


        foreach ( $this->settings['integrations'] as $integration => $details ) {

            $enable_integration = "cwp__enable__" . $integration;
            $authenticate_integration = "cwp__authenticate__" . $integration;

            register_setting (
                self::settings_group,
                $enable_integration,
                array(
                    'type'         => 'boolean',
                    'show_in_rest' => true,
                    'default'      => false,
                )
            );

            register_setting (
                self::settings_group,
                $authenticate_integration,
                array(
                    'type'         => 'boolean',
                    'show_in_rest' => true,
                    'default'      => false,
                )
            );

            $is_enabled =  get_option( $enable_integration ) === "1" ? true : false;
            $is_authenticated = get_option( $authenticate_integration ) === '1' ? true : false;

            $this->settings['integrations'][ $integration ][ 'enable' ] = $is_enabled;
            $this->settings['integrations'][ $integration ][ 'authenticated' ] = $is_authenticated;

            foreach ( $details['fields'] as $field => $initialValue ) {

                $field_group = "cwp__" . $integration  . '__' . $field;

                register_setting (
                    self::settings_group,
                    $field_group,
                    array(
                        'type'         => $initialValue['type'],
                        'show_in_rest' => true,
                        'default'      =>  $initialValue['default'],
                    )
                );
            
                //SETTING CURRENT_VALUE
                $this->settings['integrations'][ $integration  ]['fields'][ $field ]['value'] = get_option( $field_group  );
                
            }

        }

        

    }

    public function register() {

        //assets 

        //currently embedding dashboard after creating in another plugin due to conflicts of our script with webpack
        
        $production = true;

        if ($production) {
		
            $js = "http://gutenbergforms.local/wp-content/plugins/my-awesome-plugin-master/build/build.js";
            $css = "http://gutenbergforms.local/wp-content/plugins/my-awesome-plugin-master/build/build.css";
        
            wp_enqueue_script( 'cwp_dashboard_script', $js, array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element' ), 'cwp_dashboard', true );
            wp_enqueue_style( 'cwp_dashboard_stype', $css, array( 'wp-components' ) );
    
        
        } else {


            wp_enqueue_script( 'cwp_dashboard_script', plugins_url( '/', __DIR__ ) . '/dist/dashboard/build.js', array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element' ), 'cwp_dashboard', true );
            wp_enqueue_style( 'cwp_dashboard_stype', plugins_url( '/', __DIR__ ) . '/dist/dashboard/build.css', array( 'wp-components' ) );
    
        }

        add_submenu_page(
            self::parent_slug, 
            self::page_title, 
            self::page_title, 
            self::capability, 
            self::slug, 
            array($this, 'page_content'),
            1
        );

        wp_localize_script(
            'cwp_dashboard_script',
            'cwp_global',
            [
                'settings' => $this->settings,
                'informations' => $this->informations
            ]
        );


    }

    public function page_content() {
        ?>  
           <div id="cwp-gutenberg-forms-dashboard-root"></div>
        <?php
    }   
    
}
