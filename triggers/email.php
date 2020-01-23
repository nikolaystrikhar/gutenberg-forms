<?php 
    require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';

    class Email {
        
        public function __construct($post_content) {

            $this->validator = new Validator();
            $this->post_content = $post_content;

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

        private function get_templates($id) {

            $templates = array();

            foreach( $this->post_content as $f => $block ) {
                if ( $block['blockName'] === "cwp/block-gutenberg-forms" && $block['attrs']['id'] === $id ) {

                    $decoded_template = json_decode($block['attrs']['template'], JSON_PRETTY_PRINT);


                    $templates[] = $decoded_template;

                }

            }
            return $templates;
        }

        public function init() {

            $arranged_fields = array();


            foreach ( $_POST as $field_id => $field_value ) {

                $field_type = end( explode( "__", $field_id ) ); //type of the field i.e email,name etc;

                $is_valid = $this->validator->validate( $field_type, $field_value );



                $arranged_fields[] = array( 
                                        'field_data_id' => end($this->validator->decode( $field_type )),
                                        'field_value' => $field_value,
                                        'is_valid'    => $is_valid,
                                        'field_id'    => $field_id,
                                        'field_type'  => $this->validator->decode( $field_type )['type']
                );
            }


           if ( $this->is_fields_valid( $arranged_fields ) ) {
               // check if all the fields are valid;
                $this->sendMail( $arranged_fields );
           }

        }

        private function with_fields( $fields, $target ) {

            $result = $target;
            $data = array();

            foreach( $fields as $field => $field_value ) {


                $field_name = "{{".$field_value['field_type']."-".$field_value['field_data_id']."}}";
                
                if ($field_name !== "{{-}}") {
                    $data[$field_name] = $field_value['field_value'];
                }
            }


            $replaced_str = strtr($target, $data);

            // var_dump($replaced_str , $data);

            return $replaced_str;

        }

        public function sendMail( $fields ) {

            $template = $this->get_templates($_POST['submit'])[0];


            isset($template) && extract($template);

            // var_dump($fields);

            $to = "sk4915497@gmail.com";
            $mail_subject = $this->with_fields($fields, $subject);
            $mail_body = $this->with_fields($fields, $body);



            wp_mail($to,$mail_subject,$mail_body); //sending the mail;


        }
      
    }