<?php
defined( 'ABSPATH' ) || exit;

require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';
require_once plugin_dir_path( __DIR__ ) . 'admin/cpt/entry.php';
require_once plugin_dir_path( __DIR__ ) . 'Utils/Bucket.php';
require_once plugin_dir_path( __DIR__ ) . 'integrations/handler.php';
require_once plugin_dir_path( __DIR__ ) . 'tagsHandler/tagHandler.php';

/**
 * @property Validator       validator
 * @property wp_post_content post_content
 * @property array           attachments
 */
class Email {
	public function __construct( $post_content ) {

		$this->validator              = new Validator();
		$this->post_content           = $post_content;
		$this->attachments            = array();
		$this->ExternalServiceHandler = new ExternalServiceHandler();
	}

	public function is_fields_valid( $f ) {
		$len = count( $f );

		if ( $len === 0 ) {
			return false;
		} else {
			$v = true;

			foreach ( $f as $field_id => $field_value ) {
				if ( ! $field_value['is_valid'] ) {
					$v = false;
					break;
				} else {
					continue;
				}
			}

			return $v;
		}
	}

	private function get_templates( $id, $blocks = null ) {
		if ( is_null( $blocks ) ) {
			$blocks = $this->post_content;
		}

		$templates = array();

		foreach ( $blocks as $f => $block ) {
			if ( $block['blockName'] === "cwp/block-gutenberg-forms" && $block['attrs']['id'] === $id ) {

				$decoded_template = array();

				$attributes = $block['attrs'];

				if ( array_key_exists( 'template', $attributes ) ) {
					$decoded_template[] = json_decode( $attributes['template'], JSON_PRETTY_PRINT );
				} else {

					$decoded_template[] = array(
						'subject' => "",
						'body'    => "",
					);
				}

				if ( array_key_exists( 'email', $attributes ) ) {
					$user_email = $attributes['email'];


					if ( $this->validator->is_valid_admin_mail( $user_email ) ) {
						$decoded_template['email'] = $user_email;
					}
				}
				if ( array_key_exists( 'fromEmail', $attributes ) ) {
					$from_email = $attributes['fromEmail'];

					$decoded_template['fromEmail'] = $from_email;
				} else {
					$decoded_template['fromEmail'] = "";
				}

				if ( array_key_exists( 'successType', $attributes ) ) {
					$decoded_template['successType'] = $attributes['successType'];
				} else {
					$decoded_template['successType'] = "message";
				}

				if ( array_key_exists( 'successURL', $attributes ) ) {
					$decoded_template['successURL'] = $attributes['successURL'];
				} else {
					$decoded_template['successURL'] = "";
				}

				if ( array_key_exists( 'successMessage', $attributes ) ) {
					$decoded_template['successMessage'] = $attributes['successMessage'];
				} else {
					$decoded_template['successMessage'] = "The form has been submitted Successfully!";
				}

				if ( array_key_exists( 'hideFormOnSuccess', $attributes ) ) {
					$decoded_template['hideFormOnSuccess'] = $attributes['hideFormOnSuccess'];
				} else {
					$decoded_template['hideFormOnSuccess'] = false;
				}

				if ( array_key_exists( 'integrations', $attributes ) ) {
					$decoded_template['integrations'] = $attributes['integrations'];
				} else {
					$decoded_template['integrations'] = array();
				}

				if ( array_key_exists( 'actions', $attributes ) ) {
					$decoded_template['actions'] = $attributes['actions'];
				} else {
					$decoded_template['actions'] = array(
						'Record Entries',
						'Email Notification',
					);
				}

				if ( array_key_exists( 'cc', $attributes ) and $this->validator->isEmail( $attributes['cc'] ) ) {
					$decoded_template['cc'] = $attributes['cc'];
				} else {
					$decoded_template['cc'] = '';
				}

				if ( array_key_exists( 'bcc', $attributes ) and $this->validator->isEmail( $attributes['bcc'] ) ) {
					$decoded_template['bcc'] = $attributes['bcc'];
				} else {
					$decoded_template['bcc'] = '';
				}

				if ( array_key_exists( 'extendedData', $attributes ) ) {
					$decoded_template['extendedData'] = $attributes['extendedData'];
				} else {
					$decoded_template['extendedData'] = [];
				}

				$templates[] = $decoded_template;
			} else {
				$templates += $this->get_templates( $id, $block['innerBlocks'] );
			}
		}

		return $templates;
	}

	private function has_captcha( $post ) {
		if ( array_key_exists( 'g-recaptcha-response', $post ) ) {
			return true;
		} else {
			return false;
		}
	}

	private function execute_captchas( $user_response ) {

		$secretKey = get_option( 'cwp__recaptcha__client_secret' );

		if ( $secretKey === "" ) {
			return false;
		}
		if ( $user_response === "" ) {
			return false;
		}

		$verifyResponse = file_get_contents( 'https://www.google.com/recaptcha/api/siteverify?secret=' . $secretKey . '&response=' . $user_response );

		$response = json_decode( $verifyResponse, true );

		if ( array_key_exists( 'success', $response ) ) {
			return $response['success'];
		}

		return false;
	}

	// check if the post method is invoked by the gutenberg form block
	private function is_gutenberg_form_submission( $post ) {
		return array_key_exists( 'gf_form_id', $post );
	}

	/**
	 * @param array $array
	 * @param array $keys
	 *
	 * This function removes certain keys from the associative array
	 *
	 * @return array
	 */
	private function array_remove_keys( $array, $keys ) {
		$assocKeys = array();
		foreach ( $keys as $key ) {
			$assocKeys[ $key ] = true;
		}

		return array_diff_key( $array, $assocKeys );
	}

	public function init() {
		$arranged_fields = array();

		$post = $_POST;

		$post_without_submit = $this->array_remove_keys( $_POST, [ 'submit' ] );

		if ( ! $this->is_gutenberg_form_submission( $post ) ) {
			return;
		}

		if ( count( $_FILES ) !== 0 ) {
			foreach ( $_FILES as $file_id => $file_meta ) {
				if ( ! empty( $file_meta['tmp_name'] ) ) {
					$post_without_submit[ $file_id ] = $file_meta;
				}
			}
		}

		foreach ( $post_without_submit as $field_id => $field_value ) {
			$exploded_id = explode( "__", $field_id );

			$field_type = end( $exploded_id ); //type of th e field i.e email,name etc;


			$f_DECODED = $this->validator->decode( $field_type );

			$type = array_key_exists( 'type', $this->validator->decode( $field_type ) ) ? $this->validator->decode( $field_type )['type'] : "";

			$is_valid = $this->validator->validate( $type, $field_value, $field_type );

			$id = end( $f_DECODED );

			$sanitizedValue = $this->validator->sanitizedValue( $type, $field_value );

			$sanitized_field_value = null;

			if ( is_array( $field_value ) ) {
				$sanitized_field_value = join( ",", $field_value );
			} elseif ( $id === 'upload' ) {
				$sanitized_field_value = $field_value;
			} else {
				$sanitized_field_value = $sanitizedValue;
			}

			$arranged_data = array(
				'field_data_id' => $id,
				'field_value'   => $sanitized_field_value,
				'is_valid'      => $field_id === "g-recaptcha-response" ? true : $is_valid,
				'field_id'      => $field_id,
				'field_type'    => $type,
				'decoded_entry' => $this->validator->decode( $field_type ),
			);

			if ( $type === 'file_upload' ) {

				// updating attachment files;
				$file_to_upload = $_FILES;
				$file_name      = $file_to_upload[ $field_id ]['name'];
				$tmp_name       = $file_to_upload[ $field_id ]['tmp_name'];

				$parsed_alloweds = json_decode( $f_DECODED['extra_meta'], false );

				$ext = pathinfo( $file_name, PATHINFO_EXTENSION );

				$is_allowed = $this->validator->test_file_formats( $ext, $parsed_alloweds );

				if ( $is_allowed ) {

					$created_file = Bucket::upload( $tmp_name, $ext );

					$arranged_data['file_name'] = $created_file['filename'];

					$this->attachments[] = $created_file['path'];
				} else {
					$arranged_data['is_valid'] = false;
				}
			}

			if ( $this->validator->is_hidden_data_field( $field_id ) ) {

				$arranged_data['is_valid'] = true;
			}

			$arranged_fields[] = $arranged_data;
		}

		$arranged_fields = gforms_add_dynamic_values( $arranged_fields ); // adding dynamic values

		if ( $this->is_fields_valid( $arranged_fields ) ) {
			// check if all the fields are valid;
			$this->sendMail( $arranged_fields );
		}
	}

	private function url_success( $url ) {
		if ( $this->validator->isURL( $url ) ) {
			$string = '<script type="text/javascript">';
			$string .= 'window.location = "' . $url . '"';
			$string .= '</script>';

			echo $string;
		}
	}

	private function message_success( $message, $hideFormOnSuccess ) {
		$message_id = $_POST['submit'];

		$css = "div#$message_id { display: block }";

		if ( $hideFormOnSuccess === true ) {
			$css .= "\n [data-formid=" . $message_id . "] { display: none; }";
		}

		$hidden_style = "<style> $css </style>";

		echo $hidden_style;
	}

	private function message_error( $message, $response ) {
		$message_id = $_POST['submit'];
		$status     = "";

		if ( array_key_exists( 'status', $response ) ) {
			$status = $response['status'];
		}

		$css          = "div[data-id='$message_id'].$status { display: block !important; }";
		$hidden_style = "<style> $css </style>";

		echo $hidden_style;
	}

	private function attempt_success( $template ) {
		/**
		 * @var string  $successType
		 * @var string  $successURL
		 * @var string  $successMessage
		 * @var boolean $hideFormOnSuccess
		 */

		if ( ! isset( $template ) ) {
			return;
		}
		extract( $template );

		if ( $successType === "url" ) {
			$this->url_success( $successURL );
		} elseif ( $successType === "message" ) {
			$this->message_success( $successMessage, $hideFormOnSuccess );
		}
	}

	public function extract_from_details( $from ) {
		// the fromEmail from the backend comes at this pattern "Name, Email" ( comma separated )
		$details = explode( ',', trim( $from ) );

		// checking if the from contains both
		if ( sizeof( $details ) === 2 ) {
			$email = trim( $details[1] );
			$name  = trim( $details[0] );

			if ( ! $this->validator->isEmail( $email ) ) {
				return false;
			}

			return array(
				'email' => $email,
				'name'  => $name,
			);
		} else {
			return false;
		}
	}

	/**
	 * Will replace the following entities to their corresponding html element
	 * &#10; => \n [new line] => <br />
	 * &#13; => \n [new row] => <br />
	 *
	 * @param string $str
	 */
	private static function replace_line_break_entities( $str ) {
		$without_special_chars = strtr( $str, [
			'&#10;' => "\n",
			'&#13;' => "\n",
		] );

		$with_html = nl2br( $without_special_chars );

		return remove_accents( $with_html );
	}

	public function sendMail( $fields ) {
		$template   = $this->get_templates( $_POST['submit'] )[0];
		$tagHandler = new gforms_TagHandler( $fields );

		/**
		 * @var string $fromEmail
		 */

		isset( $template ) && extract( $template );

		$mail_subject = $tagHandler->merge( $template[0]['subject'] );
		$mail_body    = $tagHandler->merge( $template[0]['body'] );
		$headers      = [];

		$headers[] = 'Content-Type: text/html; charset=UTF-8';

		# line breaks can be parsed and used in the gf forms email body

		$mail_body = self::replace_line_break_entities( $mail_body );

		$CC  = $template['cc'];
		$BCC = $template['bcc'];

		if ( ! empty( $fromEmail ) and $this->validator->isEmpty( $fromEmail ) === false and $this->extract_from_details( $fromEmail ) ) {
			$from_details = $this->extract_from_details( $fromEmail );

			$from_name  = $from_details['name'];
			$from_email = $from_details['email'];

			$headers[] = "Reply-To: $from_name <$from_email>";
		}

		if ( ! $this->validator->isEmpty( $CC ) ) {
			$headers[] = 'Cc: ' . $CC;
		}

		if ( ! $this->validator->isEmpty( $BCC ) ) {
			$headers[] = 'Bcc: ' . $BCC;
		}

		$post = $_POST;

		if ( $this->has_captcha( $post ) ) {
			$captcha_success = $this->execute_captchas( $post['g-recaptcha-response'] );

			if ( ! $captcha_success ) {
				$captcha_danger = $_POST['submit'] . "-captcha";

				echo "<style> .cwp-danger-captcha#$captcha_danger { display:block !important } </style>";

				return;
			}
		}

		$newEntry       = Entries::create( $template, $mail_subject, $mail_body, $fields, $this->attachments );
		$record_entries = in_array( 'Record Entries', $template['actions'] );
		$send_email     = in_array( 'Email Notification', $template['actions'] );

		# checking if the integrations are satisfied with the given entry
		$integrations_response = $this->ExternalServiceHandler::test( $newEntry );

		if ( gettype( $integrations_response ) === 'array' and $integrations_response['can_proceed'] === false ) {

			$this->message_error( $template, $integrations_response );

			return; # exiting the sendMail function if the integrations are unsatisfied

		}


		if ( $send_email === true ) {
			if ( array_key_exists( 'email', $template ) ) {

				if ( $this->validator->isEmpty( $headers ) ) {
					wp_mail( $template['email'], $mail_subject, $mail_body, null, $this->attachments );
				} else {
					wp_mail( $template['email'], $mail_subject, $mail_body, $headers, $this->attachments );
				}

				if ( $record_entries ) {
					Entries::save( $newEntry );
				}

				$this->ExternalServiceHandler->handle( $newEntry );
				$this->attempt_success( $template );
			} else {
				if ( $this->validator->isEmpty( $headers ) ) {
					wp_mail( get_bloginfo( 'admin_email' ), $mail_subject, $mail_body, null, $this->attachments );
				} else {
					wp_mail( get_bloginfo( 'admin_email' ), $mail_subject, $mail_body, $headers, $this->attachments );
				}

				if ( $record_entries ) {
					Entries::save( $newEntry );
				}

				$this->ExternalServiceHandler->handle( $newEntry );
				$this->attempt_success( $template );
			}
		} else {
			$this->ExternalServiceHandler->handle( $newEntry );
			$this->attempt_success( $template );

			if ( $record_entries ) {
				Entries::save( $newEntry );
			}
		}
	}
}
