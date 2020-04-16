<?php

require_once plugin_dir_path( __DIR__ ) . 'integrations/mailchimp/api.php';

class Dashboard {

    const parent_slug = 'gutenberg_forms';
    const page_title = 'Dashboard';
    const capability = 'manage_options';
    const slug = 'cwp_gf_dashboard';

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'register' ) );

        $this->mail_chimp = new MailChimp();

    }

    public function register() {

        //assets 
        wp_enqueue_script( 'cwp-gutenberg-forms-dashboard-script', plugins_url( '/', __DIR__ ) . '/dist/dashboard/build.js', array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element' ), 'GUTENBERG_FORMS_DASHBOARD', true );
	    // wp_enqueue_style( 'cwp-gutenberg-forms-dashboard-style', plugins_url( '/', __FILE__ ) . 'build/dashboard/build.css', array( 'wp-components' ) );

        add_submenu_page(
            self::parent_slug, 
            self::page_title, 
            self::page_title, 
            self::capability, 
            self::slug, 
            array($this, 'page_content'),
            1
        );

        register_setting (
            'codeinwp_settings',
            'codeinwp_analytics_status',
            array(
                'type'         => 'boolean',
                'show_in_rest' => true,
                'default'      => false,
            )
        );
    
        register_setting(
            'codeinwp_settings',
            'codeinwp_analytics_key',
            array(
                'type'         => 'string',
                'show_in_rest' => true,
            )
        );

    }

    public function page_content() {
        ?>
           <div id="cwp-gutenberg-forms-dashboard-root"></div>
        <?php
    }
    
}
