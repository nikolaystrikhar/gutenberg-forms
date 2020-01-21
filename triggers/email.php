<?php 
    require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';

    class Email {
        
        public function __construct() {

            $this->validator = new Validator();

        }

        public function is_fields_valid( $f ) {

            $len = count($f);

            if ( $len === 0 ) {
                return false;
            } else {
                $v = true;

                foreach ( $f as $field_id => $field_value ) {
    
                    if ( !$field_value[ 'is_valid' ] ) {
                        $v = false;
                        break;
                    } else continue;
    
                }
    
                return $v;
            }
        }


        public function init() {

            $arranged_fields = array();


            foreach ( $_POST as $field_id => $field_value ) {

                $field_type = end( explode( "-", $field_id ) ); //type of the field i.e email,name etc;

                $is_valid = $this->validator->validate( $field_type, $field_value );

                $arranged_fields[] = array( 
                                        'field_type' => end( $this->validator->decode( $field_type ) ),
                                        'field_value' => $field_value,
                                        'is_valid'    => $is_valid
                );
            }
            

           if ( $this->is_fields_valid( $arranged_fields ) ) {
               // check if all the fields are valid;
                $this->sendMail( $arranged_fields );
           }

        }

        public function sendMail( $fields ) {

            $mail_content = array(
                'to'   => 'sk4915497@gmail.com',
                'subject' => 'The subject',
                'body'     => 'THE NEW MAIL BODY SENDED FROM THE GUTENBERG-FORMS PLUGIN',
                'headers' => array('Content-Type: text/html; charset=UTF-8','From: My Site Name &lt;support@example.com')
            );

            extract( $mail_content ); // extracting the data _ out in variables;


            mail($to, $subject, $body); //sending the mail;

        }
      
    }