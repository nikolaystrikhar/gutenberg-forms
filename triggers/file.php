<?php

class FileUpload {
    public function __construct($file_data) {
        $this->$file_data = $file_data;
    }

    public function get_valid_meta() {


        return $this->file_data;




    }
}