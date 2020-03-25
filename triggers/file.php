<?php

function get_attachment($file_data) {

    $file_name = $file_data['name'];
    $name = ABSPATH . "/uploads/$file_name.png";

    return $name;


}