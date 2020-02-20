<?php

    class Validator {

        public function isEmpty($string) {

            $len = strlen(trim($string));

            if ( $len === 0 ) return false;

            return true;

        }

        public function sanitizedValue( $type, $value ) {
            # This function will sanitize all the fields according to thier types with php build in filters.

            if ($type === "email") {
                return filter_var( $value, FILTER_SANITIZE_EMAIL );
            }

            return filter_var( $value, FILTER_SANITIZE_SPECIAL_CHARS );

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

        public function isNumber($num) {

            $as_integer = (int)$num;

            if (gettype($as_integer) === "integer") return true;
            return false;

        }

        public function validate( $type, $value ) {

            $decoded_field = $this->decode($type);


            if ( count($decoded_field) !== 0 && $decoded_field['is_required'] === true && $this->isEmpty($value)) {
                return false;
            }  else if (count($decoded_field) !== 0) {
                
                $type = $decoded_field['type'];
                $required = $decoded_field['is_required'];
                
                if ($type === "email" and $required === 'true') {
                    return $this->isEmpty($value) ? false : $this->isEmail($value);
                } else if ($type === "email" and $required === 'true') {
                    return $this->isEmpty($value) ? true : $this->isEmail($value);
                } else if ($type === 'website' and $required === 'true') {
                    return $this->isEmpty($value) ? false : $this->isURL($value);
                } else if ($type === 'website' and $required === 'false') {
                    return  $this->isEmpty($value) ? true :  $this->isURL($value);
                } else if ($type === 'number' and $required === 'true') {
                    return $this->isEmpty($value) ? true : $this->isNumber($value);
                } else if ($type === 'number' and $required === 'false') {
                    return $this->isEmpty($value) ? true :  $this->isNumber($value);
                } else if ($required === 'true') {
                    return $this->isEmpty($value);
                } else {
                    return true;
                }
              

            }

        }

    }


