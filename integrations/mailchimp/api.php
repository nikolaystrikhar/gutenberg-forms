<?php 


class MailChimp {

    const proxy = 'https://us20.api.mailchimp.com/3.0/';

    const plugin_option_slug = 'cwp_gf_integrations_mailchimp';
    const options = array(
        'api_key' 
    );

    public function __construct() {

        $this->api_key = get_option('cwp__mailchimp__api_key');

        $this->register();

    }
    
    public function get_lists() {


        $connection_uri = self::proxy . 'lists/';

        $conn =  $this->create_connection( $connection_uri, 'GET', $this->api_key );

        $data = json_decode($conn);

        $lists_names = array();


        if (!empty($data) and property_exists($data, 'lists')) {
            
            foreach ($data->lists as $key => $list ) {

                $list_data = array(
                    'name' => $list->name,
                    'value' => $list->id
                );

                $lists_names[] = $list_data;

            }

        }


        return $lists_names;

    }

    public function create_connection( $url, $request_type, $api_key, $data = array() ) {
        if( $request_type == 'GET' )
            $url .= '?' . http_build_query($data);
    
        $mch = curl_init();
        $headers = array(
            'Content-Type: application/json',
            'Authorization: Basic '.base64_encode( 'user:'. $api_key )
        );
        curl_setopt($mch, CURLOPT_URL, $url );
        curl_setopt($mch, CURLOPT_HTTPHEADER, $headers);
        //curl_setopt($mch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
        curl_setopt($mch, CURLOPT_RETURNTRANSFER, true); // do not echo the result, write it into variable
        curl_setopt($mch, CURLOPT_CUSTOMREQUEST, $request_type); // according to MailChimp API: POST/GET/PATCH/PUT/DELETE
        curl_setopt($mch, CURLOPT_TIMEOUT, 10);
        curl_setopt($mch, CURLOPT_SSL_VERIFYPEER, false); // certificate verification for TLS/SSL connection
    
        if( $request_type != 'GET' ) {
            curl_setopt($mch, CURLOPT_POST, true);
            curl_setopt($mch, CURLOPT_POSTFIELDS, json_encode($data) ); // send data in json
        }
    
        return curl_exec($mch);
    }

    public function add_subscriber( $entry ) {
       
       
       
        $apiKey = $this->api_key;
        $listId = $entry['list'];
        
        $memberId = md5(strtolower($entry['EMAIL']));
        $dataCenter = substr($apiKey,strpos($apiKey,'-')+1);
        $url = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listId . '/members/' . $memberId;
    
        $json = json_encode([
            'email_address' => $entry['EMAIL'],
            'status'        => 'subscribed', // "subscribed","unsubscribed","cleaned","pending"
            'merge_fields'  => [
                'FNAME'     => $entry['FNAME'],
                'LNAME'     => $entry['LNAME'],
                'address'   => $entry['ADDRESS'],
                'birthday'  => $entry['BIRTHDAY'],
                'phone'     => $entry['PHONE']
            ]
        ]);
    
        $ch = curl_init($url);
    
        curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);                                                                                                                 
    
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    
        return $httpCode;
    }

    public function post( $submission ) {

        $this->add_subscriber($submission);


    }

    public function register() {

        //registering the required settings to setup mailchimp
        register_setting (
            self::plugin_option_slug,
            'api_key'
        );

    }

}