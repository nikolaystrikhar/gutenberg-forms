<?php 


/**
 * Handles the uploads and various function that includes multimedia
 */

class Bucket {


    const plugin_upload_dir = 'gutenberg-forms-uploads';
    const plugin_upload_path = WP_CONTENT_DIR . '/uploads' . '/' . self::plugin_upload_dir;
    
    public static function generate_hexed_filename( $extension ) {


        $hexed_file_name = md5(uniqid(rand(), true));

        $hexed_file_name .= ".$extension";

        return $hexed_file_name;

    }

    /**
     * 
     * upload
     * @param file Uploads the file to the plugin_upload_directory   
     * 
     */

    public static function upload( $tmp_name, $extension ) {

        wp_mkdir_p( self::plugin_upload_path ); // creating the plugin_upload dir if not created

        $file_name = self::generate_hexed_filename( $extension );

        move_uploaded_file( $tmp_name, self::plugin_upload_path . '/' . $file_name);
        
        $file_path = self::plugin_upload_path . '/' . $file_name;        

        return array(
            'path' => $file_path,
            'filename' => $file_name
        );

    }
}