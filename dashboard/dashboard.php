<?php

require_once plugin_dir_path( __DIR__ ) . 'integrations/mailchimp/api.php';

class Dashboard {

    const parent_slug = 'gutenberg_forms';
    const page_title = 'Dashboard';
    const capability = 'manage_options';
    const slug = 'cwp_gf_dashboard';
    const settings_group = "gutenberg_forms_setting";

    // const MailChimp = new MailChimp(); 

    public function __construct() {
        
        add_action( 'admin_menu', array( $this, 'register' ) );

        //services..
        $this->mail_chimp = new MailChimp();
        $this->informations = array(
            
            'cards' => array(
                array(
                    'title' => 'Need And Expert Support',
                    'description'   => 'Sunny',
                    'media'     => array(
                        'type' => 'img',
                        'src'  => 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRpmgRHxFKVxi9E6kyE3rOcmIo1IywM6qly-uOKeRaYKm59RuLv&usqp=CAU'
                    ),
                    'action'    => array(
                        'link' => 'https://www.google.com/',
                        'label' => 'Contact Us'
                    ) 
                ),
                array(
                    'title' => 'Need And Expert Support 2',
                    'description'   => 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using , making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as',
                    'media'     => array(
                        'type' => 'img',
                        'src'  => 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMncDgvMswtacs8aylNlw2Gt5h_BnCaEBI8ZNF3TKYvjuL-9Cm&usqp=CAU'
                    ),
                    'action'    => array(
                        'link' => 'https://www.google.com/',
                        'label' => 'Contact Us'
                    ) 
                )
            )

        );

        $this->settings = array(
            'integrations' => array(
                'mailchimp' => array(
                    'title' => 'Mail Chimp',
                    'guide' => $this->get_guide_content( 'mailchimp'  ),
                    'description' => 'Bring new life to your lists with upgraded Mailchimp signup forms for WordPress! Easy to build and customize with no code required. Link to lists and interest groups!',
                    'banner' => 'https://us20.admin.mailchimp.com/release/1.1.132c826603d26483f97297c92082b7e461f3c8cb4/images/brand_assets/logos/mc-freddie-dark.svg',
                    'fields' => array(
                        'api_key' =>  array(
                            'label' => 'Api Key',
                            'default' => '',
                            'type' => 'string'
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

            register_setting (
                self::settings_group,
                $enable_integration,
                array(
                    'type'         => 'boolean',
                    'show_in_rest' => true,
                    'default'      => false,
                )
            );

            $is_enabled =  get_option( $enable_integration ) === "1" ? true : false;

            $this->settings['integrations'][ $integration ][ 'enable' ] = $is_enabled;

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
