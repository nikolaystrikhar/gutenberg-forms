<?php

    class Validator {

        public function isEmpty($string) {

            $len = strlen(trim($string));

            if ( $len === 0 ) return false;

            return true;

        }

        public function isEmail($email) {

            if ( !filter_var( $email , FILTER_VALIDATE_EMAIL ) ) return false;

            return true;

        }

        public function isURL( $website ) {
            if (!preg_match("/\b(?:(?:https?|ftp):\/\/|www\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i",$website)) {
                return false;
            } else {
                return true;
            }
        }


        public function decode($t) {

            $dV = explode('-', urldecode(base64_decode($t)));


            if (count($dV) === 1) {
                return array();
            }

            return array(
                'is_required' => $dV[4],
                'type'        => preg_replace('/[0-9]+/' , '' , $dV[2]),
                'field_id'    => $dV[3]
            );


        }

        public function validate( $type, $value ) {

            $decoded_field = $this->decode($type);

            if ( count($decoded_field) !== 0 && $decoded_field['is_required'] === true && $this->isEmpty($value)) {
                return false;
            }  else if (count($decoded_field) !== 0) {
                switch ( $decoded_field[ 'type' ] ) {

                    case 'email' : return $this->isEmail($value);
                    break;
                    case 'website': return $this->isURL($value);
                    break;
                    default: return true;

                }
            }

        }

    }


