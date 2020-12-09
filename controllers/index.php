<?php

require_once plugin_dir_path(__FILE__) . 'entries/entries.controller.php';
require_once plugin_dir_path(__FILE__) . 'forms/forms.controller.php';

# registering all the rest controllers

$entries_controller = new cwp_gf_Entries_Controller();
$forms_controller = new cwp_gf_Forms_controller();

# for filtering with meta queries

add_filter('rest_cwp_gf_entries_query', array($entries_controller, 'register_filters'), 10, 2);
add_action('rest_api_init', function () use ($entries_controller, $forms_controller) {

    $entries_controller->register_routes();
    $entries_controller->register_fields();
    $forms_controller->register_routes();
});
add_filter('rest_query_vars', function ($vars) {

    $extra_filters = array('post', 'post__in', 'type', 'id');

    $vars[] = 'meta_query';
    $vars = array_merge($vars, $extra_filters);

    return $vars;
});
