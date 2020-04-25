<?php

class ExternalServiceHandler {


    public static function parse_entry( $entry, $integration ) {
        
        $fields = $entry['fields'];

        $integration_with_values = array();


        foreach ($integration as $name => $field_id) {

            if ( gettype($field_id) === 'string' and array_key_exists($field_id, $fields)) {
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


            add_action(
                'gutenberg_forms_submission__' . $name,
                $parsed_entry
            );

        }

    }

}