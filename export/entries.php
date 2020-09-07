<?php

require_once plugin_dir_path(__DIR__) . './triggers/functions.php';


/**
 * This will be responsible for the exports of gutenberg form entries
 */

class cwp_gf_Entries_export_handler
{
    const supported_formats = ['csv', 'json', 'xls'];
    const post_type = "cwp_gf_entries";
    const fields_meta_key = 'fields__' . self::post_type;
    const extra_info_meta_key = 'extra__' . self::post_type;

    /**
     * Check if the user has permission to export other safety checks
     */

    public static function is_permitted()
    {

        // Check if we are in wordpress admin
        if (!is_admin()) {
            return false;
        }


        return true;
    }

    /**
     * Will test each field value and stringify the value if it contain comma 
     * @param array $fields 
     * @return array $escaped_fields
     */

    public static function escaped($fields)
    {

        $escaped_fields = [];

        foreach ($fields as $field_name => $field_value) :

            $field_chars = str_split($field_value);
            $has_special_csv_char = in_array(',', $field_chars);

            if ($has_special_csv_char) {
                # this value needs quotes around
                $escaped_fields[$field_name] = '' . $field_value . '';
            } else {
                $escaped_fields[$field_name] = $field_value;
            }

        endforeach;
        return $escaped_fields;
    }

    /**
     * Check if the given export format is supported by gutenberg forms exports
     * @param string $format export format
     */

    public static function is_supported($format)
    {
        return in_array($format, self::supported_formats);
    }

    /**
     * Will open json stream and download json export file
     * @param array ?$args = [] - If provided entries will be filtered 
     */

    public static function json_export($args = [])
    {
        $args['post_type'] = self::post_type;
        $args['posts_per_page'] = -1; # for returning all posts

        if (!self::is_permitted()) :
            wp_die('Permission Issue');
        endif;

        $entries = get_posts($args);
        $response_json = [];
        $filename = 'guten-forms-entries-' . time() . '.json';

        foreach ($entries as $key => $entry) :

            $fields = get_post_meta($entry->ID, 'fields__' . self::post_type, true);
            $entry_extra_info = get_post_meta($entry->ID, 'extra__' . self::post_type, true);
            $form_id = get_post_meta($entry->ID, "form_id__" . self::post_type, true);

            $entry_info = [
                'Form ID'    => $form_id,
                'fields' => $fields,
                'additional_information' => $entry_extra_info
            ];

            $response_json[] = $entry_info;

        endforeach;

        $data = json_encode($response_json);
        header('Content-Type: application/json');
        header("Content-Disposition: attachment; filename=$filename");
        header('Expires: 0'); //No caching allowed
        header('Cache-Control: must-revalidate');
        header('Content-Length: ' . strlen($data));
        file_put_contents('php://output', $data);
        die();
    }

    /**
     * 
     * Will open csv stream and download the csv export file
     * @param array ?$args = [] - If provided entries will be filtered 
     * 
     */

    public static function excel_export($args = [], $format)
    {

        $args['post_type'] = self::post_type;
        $args['posts_per_page'] = -1; # for returning all posts

        if (!self::is_permitted()) :
            wp_die(__('Permission Issue'));
        endif;

        ob_start();

        $file_name = 'gutenberg-form-entries-' . '-' . time() . ".$format";
        $headers = [];
        $rows = [];

        $entries = get_posts($args);

        foreach ($entries as $key => $entry) :

            $fields = get_post_meta($entry->ID, 'fields__' . self::post_type, true);

            $escaped_fields = self::escaped($fields);

            foreach ($fields as $field_name => $field_value) :

                if (!in_array($field_name, $headers)) :

                    $headers[] = $field_name;

                endif;

            endforeach;

            $rows[] = cwp_gf_order_by($headers, $escaped_fields);

        endforeach;

        $fh = @fopen('php://output', 'w');
        fprintf($fh, chr(0xEF) . chr(0xBB) . chr(0xBF));
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Description: File Transfer');
        header("Content-type: text/$format");
        header("Content-Disposition: attachment; filename={$file_name}");
        header('Expires: 0');
        header('Pragma: public');
        fputcsv($fh, $headers);

        foreach ($rows as $data_row) {
            fputcsv($fh, $data_row);
        }

        fclose($fh);
        ob_end_flush();
        die();
    }

    /**
     * @param string $format export formats - Must be supported
     * @param array  $args filter entries based on this arguments
     */

    public static function export($format, $args = [])
    {

        $is_supported = self::is_supported($format);
        if (!$is_supported) return;

        switch ($format):

            case 'csv':
                self::excel_export($args, 'csv');
                break;

            case 'xls':
                self::excel_export($args, 'xls');
                break;

            case 'json':
                self::json_export($args);


        endswitch;
    }
}
