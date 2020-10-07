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
            'icon'        => 'email',
            'cpt'         => 'wpcf7_contact_form'
        ]
    ];

    public function __construct($namespace)
    {
        $this->namespace = $namespace;
    }

    public function register_routes()
    {

        $supported_plugins = self::supported_plugins;

        # for getting the list of forms plugins available and supported to import their forms

        register_rest_route($this->namespace, '/imports/plugins', array(

            array(
                'methods'   => 'GET',
                'callback'  => array($this, 'get_plugin_list'),
            ),

        ));

        # for getting all the available post types title/slug

        register_rest_route($this->namespace, '/imports/plugins/options', array(

            array(
                'methods'   => 'GET',
                'callback'  => function ($request) use ($supported_plugins) {
                    return $this->get_plugin_options($supported_plugins, $request);
                },
            ),

        ));

        # for converting the forms and importing them

        register_rest_route($this->namespace, '/import/plugin', array(

            array(
                'methods'   => 'POST',
                'callback'  => array($this, 'import_forms'),
            ),

        ));
    }

    /**
     * Will import the form from the selected 3rd party plugin
     */

    public function import_forms()
    {
        return [];
    }

    /**
     * Will return a list of forms available for exports
     * @param array[] list of supported plugins for conversion
     * @param WP_Request $request
     * @return array[] available Forms 
     */

    public function get_plugin_options($supported_plugins, $request)
    {
        $plugin = $request['plugin'];
        $search = $request['search'];
        $plugin_cpt_slug = '';

        if (array_key_exists($plugin, $supported_plugins))
            $plugin_cpt_slug = $supported_plugins[$plugin]['cpt'];

        # some safety check
        if ($plugin_cpt_slug === '')
            return [];

        $posts = get_posts([
            'post_type' => $plugin_cpt_slug,
            's'         => $search,
            'numberposts' => 5
        ]);

        $reduced_post = [];

        foreach ($posts as $post) :

            $post_detail = [
                'title' => property_exists($post, 'post_title') ? $post->post_title : '',
                'id'    => property_exists($post, 'ID') ? $post->ID : -1
            ];

            $reduced_post[] = $post_detail;


        endforeach;

        return $reduced_post;
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
