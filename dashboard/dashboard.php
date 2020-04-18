<?php

require_once plugin_dir_path( __DIR__ ) . 'integrations/mailchimp/api.php';

class Dashboard {

    const parent_slug = 'gutenberg_forms';
    const page_title = 'Dashboard';
    const capability = 'manage_options';
    const slug = 'cwp_gf_dashboard';
    const option_group = "gutenberg_forms_options";

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'register' ) );
        add_action('init' , array($this, 'register_settings'));

        $this->mail_chimp = new MailChimp();

    }

    public function register_settings() {
        register_setting (
            'cwp_settings',
            'test',
            array(
                'type'         => 'string',
                'show_in_rest' => true,
                'default'      => 'hello World',
            )
        ); 
    }

    public function register() {

        //assets 
        
        $production = false;

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

    

        $settings = array(

            'integrations' => array(
                'mailchimp' => array(
                    'title' => 'Mail Chimp',
                    'description' => 'Bring new life to your lists with upgraded Mailchimp signup forms for WordPress! Easy to build and customize with no code required. Link to lists and interest groups!',
                    'banner' => 'http://gutenbergforms.local/wp-content/plugins/ninja-forms/assets/img/add-ons/mail-chimp.png',
                    'fields' => array(
                        'api_key' =>  array(
                            'label' => 'Api Key',
                            'default' => '',
                            'type' => 'string'
                        ),
                        'private_key' =>  array(
                            'label' => 'Private Key',
                            'default' => '',
                            'type' => 'string'
                        )
                    )
                )
            )

        );


        foreach ( $settings['integrations'] as $integration => $details ) {

            $enable_integration = "cwp__enable__" . $integration;

            register_setting (
                'options',
                $enable_integration,
                array(
                    'type'         => 'boolean',
                    'show_in_rest' => true,
                    'default'      => false,
                )
            );

            foreach ( $details['fields'] as $field => $initialValue ) {

                $field_group = "cwp__" . $integration  . '__' . $field;

                register_setting (
                    'options',
                    $field_group,
                    array(
                        'type'         => $initialValue['type'],
                        'show_in_rest' => true,
                        'default'      =>  $initialValue['default'],
                    )
                ); 
                
            }

        }

        wp_localize_script(
            'cwp_dashboard_script',
            'cwp_global',
            [
                'settings' => $settings
            ]
        );

    }

    public function page_content() {
        ?>  
           <div id="cwp-gutenberg-forms-dashboard-root"></div>
        <?php
    }   
    
}
