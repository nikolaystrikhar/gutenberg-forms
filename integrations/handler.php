<?php

class ExternalServiceHandler {

    public static function is_field_id ( $name ) {

        if (is_array($name)) {
            return false;
        }

        $res = false;
        $breaked = explode('_', $name);
        $fields = [
                'name', 
                'email', 
                'radio', 
                'checkbox', 
                'message', 
                'datepicker',
                'file_upload',
                'number',
                'phone',
                'select',
                'text',
                'website',
                'yes_no',
        ];

        if (array_key_exists(0 , $breaked) and in_array( $breaked[0], $fields )) {
            $res = true;
        }


        return $res;

    }

    public static function parse_entry( $entry, $integration ) {
        
        $fields = $entry['fields'];

        $integration_with_values = array();

        foreach ($integration as $name => $field_id) {

            

            if ( gettype($field_id) === 'string' and array_key_exists($field_id, $fields)) {
                $integration_with_values[$name] = $fields[$field_id];
            } else if ( self::is_field_id( $field_id ) ) {
                $integration_with_values[$name] = '';
            } else {
                $integration_with_values[$name] = $field_id ;
            }

        }

        return $integration_with_values;

    }

    public static function test( $entry ) {
        $integrations = $entry['integrations'];
        
        # if all the integrations are satisfied with the entry
        # then we can proceed with the submission
        $integrations_status = [];
        $integration_response;

        foreach ($integrations as $name => $integration) {
            
            $parsed_entry = self::parse_entry($entry, $integration);

            # adding the status of this integration in all status
            $response = apply_filters('gutenberg_forms_submission__status__' . $name, $entry);


            if (array_key_exists('can_proceed', $response)) {

                $integrations_status[] = $response['can_proceed'];

            }

            if (array_key_exists('can_proceed', $response) and $response['can_proceed'] === false) {

                $integrations_response = $response;

            }

        }

        $can_proceed_with_submission = !in_array(false, $integrations_status, true); 

        if ($can_proceed_with_submission) {
            return true;
        }

        return $response;

    }

    public function handle($entry) {

        $integrations = $entry['integrations'];
        $integrations_response = self::test( $entry );

        if ( gettype($integrations_response) === 'array' and $integrations_response['can_proceed'] === false ) return;

        foreach( $integrations as $name => $integration ) {

            $parsed_entry = $this->parse_entry($entry, $integration);
            
            # finally proceeding
            do_action(
                'gutenberg_forms_submission__' . $name,
                $parsed_entry
            );

        }


    }

}