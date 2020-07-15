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

    public function handle($entry) {

        $integrations = $entry['integrations'];

        foreach ($integrations as $name => $integration) {
            
            $parsed_entry = $this->parse_entry($entry, $integration);

            do_action(
                'gutenberg_forms_submission__' . $name,
                $parsed_entry
            );

        }

    }

}