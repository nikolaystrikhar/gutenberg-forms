<?php 
    require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';

    function array_remove_keys($array, $keys) {
 
        // array_diff_key() expected an associative array.
        $assocKeys = array();
        foreach($keys as $key) {
            $assocKeys[$key] = true;
        }
     
        return array_diff_key($array, $assocKeys);
    }


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

                    $decoded_template = array();
                                        
                    $attributes = $block['attrs'];

                    if (array_key_exists('recaptcha' , $attributes)) {
                        $decoded_template['recaptcha'] = $attributes['recaptcha']; 
                    }


                    if (array_key_exists('template' , $attributes)) {
                        $decoded_template[] = json_decode($attributes['template'], JSON_PRETTY_PRINT);
                    } else {

                        $decoded_template[] = array(
                            'subject' => "",
                            'body'    => ""
                        );
                    }

                    if (array_key_exists('email' ,$attributes)) {
                        $user_email = $attributes['email'];

                        if ($this->validator->validate('email' , $user_email)) {
                            $decoded_template['email'] = $user_email;
                        }
                    }
                    if (array_key_exists('fromEmail' ,$attributes)) {
                        $from_email = $attributes['fromEmail'];

                        if ($this->validator->isEmail($from_email)) {
                            $decoded_template['fromEmail'] = $from_email;
                        }
                    } else {
                        $decoded_template['fromEmail'] = "";
                    }

                    if (array_key_exists('successType' , $attributes)) {
                        $decoded_template['successType'] = $attributes['successType'];
                    } else {
                        $decoded_template['successType'] = "message";
                    }

                    if (array_key_exists('successURL' , $attributes)) {
                        $decoded_template['successURL'] = $attributes['successURL'];
                    } else {
                        $decoded_template['successURL'] = "";
                    }

                    if (array_key_exists('successMessage' , $attributes)) {
                        $decoded_template['successMessage'] = $attributes['successMessage'];
                    } else {
                        $decoded_template['successMessage'] = "The form has been submitted Successfully!";
                    }

                    
                    $templates[] = $decoded_template;



                }

            }
            return $templates;
        }


        private function has_captcha($post){
            if (array_key_exists('g-recaptcha-response' , $post)) {
                return true;
            } else return false;
        }

        private function execute_captchas($user_response , $secretKey) {

            if ($secretKey === "") return false;
            if ($user_response === "") return false;            
            
            
            $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secretKey.'&response='.$user_response); 
        
            $response = json_decode($verifyResponse, true);

            if (array_key_exists('success' , $response) ) {
                return $response['success'];
            } 

            return false;
        }   




        public function init() {


            $arranged_fields = array();

            $post = $_POST;

            $post_without_submit = array_pop($post);


            foreach ( $post as $field_id => $field_value ) {
                $exploded_id = explode( "__", $field_id );

                $field_type = end( $exploded_id ); //type of th e field i.e email,name etc;

                $is_valid = $this->validator->validate( $field_type, $field_value );

                $f_DECODED = $this->validator->decode( $field_type ); 


                $type = array_key_exists('type' , $this->validator->decode( $field_type )) ? $this->validator->decode( $field_type )['type'] : "";

                $id = end($f_DECODED);

                $sanitizedValue = $this->validator->sanitizedValue($type, $field_value);

                $arranged_fields[] = array( 
                    'field_data_id' => $id,
                    'field_value' => is_array($field_value) ? join("," , $field_value) : $sanitizedValue,
                    'is_valid'    => $field_id === "g-recaptcha-response" ? true: $is_valid,
                    'field_id'    => $field_id, 
                    'field_type'  =>  $type
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


            return $replaced_str;

        }

        private function url_success($url) {
            
            if ($this->validator->isURL($url)) {
                $string = '<script type="text/javascript">';
                $string .= 'window.location = "' . $url . '"';
                $string .= '</script>';

                echo $string;
            }

        }

        private function message_success( $message ) {

            $message_id = $_POST['submit'];

            $hidden_style = "<style> #$message_id { display: block !important } </style>";

            if ($this->validator->isEmpty($message)) {
                echo $hidden_style;
            }

        }

        private function attempt_success( $template ) {

            if (!isset($template)) return;
            extract($template);

            if ($successType === "url") {
                $this->url_success($successURL);
            } else if ($successType === "message") {
                $this->message_success($successMessage);
            }

        }

        private function get_multiple($field) {
            if( isset($field) && is_array($field) ) {
                return $fieldList = implode(', ', $field);
            }
        }

        public function sendMail( $fields ) {

            $template = $this->get_templates($_POST['submit'])[0];


            isset($template) && extract($template);


            $mail_subject = $this->with_fields($fields, $template[0]['subject']);
            $mail_body = $this->with_fields($fields, $template[0]['body']);
            

            $post = $_POST;


            if ($this->has_captcha($post)) {
                $captcha_success = $this->execute_captchas($post['g-recaptcha-response'], $template['recaptcha']['clientSecret']);

                if (!$captcha_success) {
                    $captcha_danger = $_POST['submit']."-captcha";

                    echo "<style> .cwp-danger-captcha#$captcha_danger { display:block !important } </style>";

                    return;
                }
            }

            if (array_key_exists('email' , $template)) {
                if ($this->validator->isEmpty($fromEmail)) {
                    wp_mail($template['email'],$mail_subject,$mail_body);
                } else {
                   wp_mail($template['email'],$mail_subject,$mail_body , "From: $fromEmail");
                }
                 
                
                $this->attempt_success($template);
            } else {

                if ($this->validator->isEmpty($fromEmail)) {
                    wp_mail(get_bloginfo('admin_email'),$mail_subject,$mail_body);
                } else {
                    wp_mail(get_bloginfo('admin_email'),$mail_subject,$mail_body , "From: $fromEmail");
                }
                $this->attempt_success($template);
            }
        }
    }