<?php

require_once plugin_dir_path(__FILE__) . 'entries/entries.controller.php';

# registering all the rest controllers

function cwp_gf_register_rest_controllers()
{

    $entries_controller = new cwp_gf_Entries_Controller();
    $entries_controller->register_routes();
}

add_action('rest_api_init', 'cwp_gf_register_rest_controllers');
