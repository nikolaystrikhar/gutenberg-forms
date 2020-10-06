<?php

/**
 * - This controller is used for handling imports of forms from 3rd party plugins
 * - into gutenberg forms
 */


class cwp_gf_Forms_Import_controller
{

    const supported_plugins = [
        'contact-form-7' => [
            'description' => 'Import your existing forms and the relevant plugin settings from the Contact Form 7.',
            'icon'        => 'email'
        ]
    ];

    public function __construct($namespace)
    {
        $this->namespace = $namespace;
    }

    public function register_routes()
    {

        # for getting the list of forms plugins available and supported to import their forms

        register_rest_route($this->namespace, '/imports/plugins', array(

            array(
                'methods'   => 'GET',
                'callback'  => array($this, 'get_plugin_list'),
            ),

        ));
    }

    /**
     * Will return the available plugin for importing their forms
     * @return array plugin list
     */

    public function get_plugin_list()
    {

        $installed_plugins = get_plugins();
        $list = [];


        foreach ($installed_plugins as $plugin_script => $installed_plugin) {


            $plugin_text_domain = array_key_exists('TextDomain', $installed_plugin) ? $installed_plugin['TextDomain'] : '';
            $is_plugin_conversion_supported = array_key_exists($plugin_text_domain, self::supported_plugins);
            $is_plugin_active = is_plugin_active($plugin_script);


            if ($is_plugin_conversion_supported and $is_plugin_active) {

                // merging default details
                $list[] = array_merge($installed_plugin, self::supported_plugins[$plugin_text_domain]);;
            }
        }

        return $list;
    }
}
