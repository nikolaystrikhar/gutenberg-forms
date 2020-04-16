<?php 


class MailChimp {


    const plugin_option_slug = 'cwp_gf_integrations_mailchimp';
    const options = array(
        'api_key' 
    );

    public function __construct() {

        $this->register();

    }

    public function register() {

        //registering the required settings to setup mailchimp
        register_setting (
            self::plugin_option_slug,
            'api_key'
        );

    }

}