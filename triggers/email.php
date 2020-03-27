<?php
    require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';
    require_once plugin_dir_path( __DIR__ ) . 'triggers/file.php';

    function array_remove_keys($array, $keys) {

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
            $this->attachments = array();

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


        private function get_templates($id, $blocks = null) {
            if (is_null($blocks)) {
                $blocks = $this->post_content;
            }

            $templates = array();

            foreach( $blocks as $f => $block ) {

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

                        if ($this->validator->isEmail($user_email)) {
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

                    if (array_key_exists('hideFormOnSuccess' , $attributes)) {
                        $decoded_template['hideFormOnSuccess'] = $attributes['hideFormOnSuccess'];
                    } else {
                        $decoded_template['hideFormOnSuccess'] = false;
                    }

                    $templates[] = $decoded_template;
                    
                } else {
                    $templates += $this->get_templates($id, $block['innerBlocks']);
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

            $post_without_submit = array_remove_keys($_POST,['submit']);

            if (count($_FILES) !== 0) {
                foreach ($_FILES as $file_id => $file_meta) {
                    $post_without_submit[$file_id] = $file_meta;
                }
            }

            foreach ( $post_without_submit as $field_id => $field_value ) {
                $exploded_id = explode( "__", $field_id );

                $field_type = end( $exploded_id ); //type of th e field i.e email,name etc;


                $f_DECODED = $this->validator->decode( $field_type );


                $type = array_key_exists('type' , $this->validator->decode( $field_type )) ? $this->validator->decode( $field_type )['type'] : "";

                $is_valid = $this->validator->validate( $type, $field_value, $field_type );

                $id = end($f_DECODED);

                $sanitizedValue = $this->validator->sanitizedValue($type, $field_value);

                $sanitized_field_value = NULL;

                if (is_array($field_value)) {
                    $sanitized_field_value = join("," , $field_value);
                } else if ( $id === 'upload' ) {
                    $sanitized_field_value = $field_value;
                } else {
                    $sanitized_field_value = $sanitizedValue;
                }

                $arranged_data = array(
                    'field_data_id' => $id,
                    'field_value' => $sanitized_field_value,
                    'is_valid'    => $field_id === "g-recaptcha-response" ? true: $is_valid,
                    'field_id'    => $field_id,
                    'field_type'  =>  $type
                );



                if ($type === 'file_upload') {

                    // updating attachment files;

                    $file_to_upload = $_FILES;
                    $file_name = $file_to_upload[$field_id]['name'];
                    $tmp_name = $file_to_upload[$field_id]['tmp_name'];

                    $allowed_defaults =  array(
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "pdf",
                        "doc",
                        "docx",
                        "ppt",
                        "pptx",
                        "odt",
                        "avi",
                        "ogg",
                        "m4a",
                        "mov",
                        "mp3",
                        "mp4",
                        "mpg",
                        "wav",
                        "wmv"
                    );
                    $parsed_alloweds =  json_decode($f_DECODED['extra_meta'], false);

                    // $allowed = sizeof($parsed_alloweds) === 0 ? $allowed_defaults : $parsed_alloweds;
                    
                    $ext = pathinfo($file_name, PATHINFO_EXTENSION);
                    
                    if( in_array($ext,$allowed_defaults) ) {
                        move_uploaded_file( $tmp_name, WP_CONTENT_DIR.'/uploads/'.basename( $file_name ) );
                        $file_path = WP_CONTENT_DIR.'/uploads/'.basename( $file_name );

                        $this->attachments[] = $file_path;
                        
                    } else {
                        $arranged_data['is_valid'] = false;
                    }
                    
                }

                $arranged_fields[] = $arranged_data;
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

        private function message_success( $message, $hideFormOnSuccess ) {


            $message_id = $_POST['submit'];


            $css = "#$message_id { display: block }";


            if ($hideFormOnSuccess === true) {
                $css .= "\n [data-formid=".$message_id."] { display: none; }";
            }

            $hidden_style = "<style> $css </style>";


            echo $hidden_style;

        }

        private function attempt_success( $template ) {

            if (!isset($template)) return;
            extract($template);

            if ($successType === "url") {
                $this->url_success($successURL);
            } else if ($successType === "message") {
                $this->message_success($successMessage, $hideFormOnSuccess);
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
            $headers = '';


            if ( count( $this->attachments ) !== 0 ) {
                $headers .= 'Content-type: multipart/mixed; charset=iso-8859-1' . "\r\n";
            }

            if (!is_null($fromEmail)) {
                $headers .= "From: $fromEmail";
            }

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

                if ($this->validator->isEmpty($headers)) {
                    print 'MAIL SENDED';

                    // wp_mail($template['email'],$mail_subject,$mail_body , null, $this->attachments);
                } else {
                    print 'MAIL SENDED';
                    // wp_mail($template['email'],$mail_subject,$mail_body , $headers, $this->attachments);
                }

                $this->attempt_success($template);

            } else {

                if ($this->validator->isEmpty($headers)) {
                    print 'MAIL SENDED';

                    // wp_mail(get_bloginfo('admin_email'),$mail_subject,$mail_body, null, $this->attachments);
                } else {
                    print 'MAIL SENDED';

                    // wp_mail(get_bloginfo('admin_email'),$mail_subject,$mail_body , $headers , $this->attachments);
                }
                
                $this->attempt_success($template);
            }
        }
    }