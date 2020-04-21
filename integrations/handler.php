<?php

require_once plugin_dir_path( __FILE__ ) . 'mailchimp/api.php';


class ExternalServiceHandler {


    public function __construct() {


        $this->MailChimp = new MailChimp(); 

    }


    public static function parse_entry( $entry, $integration ) {
        
        $fields = $entry['fields'];

        $integration_with_values = array();


        foreach ($integration as $name => $field_id) {

            if (array_key_exists($field_id, $fields)) {
                $integration_with_values[$name] = $fields[$field_id];
            } else {
                $integration_with_values[$name] = $field_id;
            }

        }

        return $integration_with_values;

    }

    public function handle($entry) {

        $integrations = $entry['integrations'];

        foreach ($integrations as $name => $integration) {
            
            $parsed_entry = $this->parse_entry($entry, $integration);

            switch ( $name ) {

                case 'mailchimp':
                    $this->MailChimp->post( $parsed_entry );

            }

        }

    }

}