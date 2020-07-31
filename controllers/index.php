<?php

require_once plugin_dir_path(__FILE__) . 'entries/entries.controller.php';

# registering all the rest controllers

function cwp_gf_register_rest_controllers()
{

    $entries_controller = new cwp_gf_Entries_Controller();
    $entries_controller->register_routes();
    $entries_controller->register_fields();
}

# for filtering with meta queries

add_filter('rest_cwp_gf_entries_query', function ($args, $request) {
    $args += array(
        'meta_key'   => 'status__cwp_gf_entries',
        'meta_value' => $request['entry_status'],
        'meta_query' => $request['meta_query'],
    );

    return $args;
}, 10, 2);


add_action('rest_api_init', 'cwp_gf_register_rest_controllers');
