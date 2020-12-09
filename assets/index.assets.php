<?php

// TODO make the enqueve function global with the tests so that assets can be loaded conditionally from any other part of the plugin


/**
 * All assets will be loaded from this file
 * Either they are conditional assets or not
 */

class cwp_gf_AssetsHandler
{

    public function __construct($blocks)
    {
        $this->blocks = $blocks; # current post blocks
    }

    /**
     * Will enqueue required assets in the post based on block attributes
     */

    public function enqueue()
    {
        wp_enqueue_script('gutenberg_forms-recaptcha-render-script', plugins_url('/', __FILE__) . 'scripts/recaptcha-render.js', array('jquery'), 'latest', true);
        wp_enqueue_script('gutenberg_forms-recaptcha', "https://www.google.com/recaptcha/api.js", array('gutenberg_forms-recaptcha-render-script'), '', true);
    }
}
