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
     * Will parse the attributes on the forms in the current page
     * @param array,null $blocks
     * @param string $attr - Attribute Key to find
     * @param any $default - Default value if the given attribute is not found
     * @return array - Attributes
     */

    public function get_page_forms($blocks = null,  $attr = "", $default = [])
    {
        if (is_null($blocks)) {
            $blocks  = $this->blocks;
        }

        $page_forms_attributes = [];

        foreach ($blocks as $f => $block) {

            if ($block['blockName'] === "cwp/block-gutenberg-forms") {

                $decoded_template = array();

                $attributes = $block['attrs'];

                if (array_key_exists($attr, $attributes)) {
                    $decoded_template[$attr] = $attributes[$attr];
                } else {
                    $decoded_template[$attr] = $default;
                }
                $form_id = $block['attrs']['id'];
                $page_forms_attributes[$form_id] = $decoded_template;
            } else {
                $page_forms_attributes += $this->get_page_forms($block['innerBlocks']);
            }
        }

        return $page_forms_attributes;
    }

    /**
     * Will check if the given value of attribute is matched with any form in the page
     */

    public function test_attributes($forms, $callback)
    {

        $res = false;

        foreach ($forms as $form_id => $attributes) :


            if (is_array($attributes) and !empty($attributes)) :

                foreach ($attributes as $attr) :

                    $res = $callback($attr);

                endforeach;

            endif;

        endforeach;

        return $res;
    }

    /**
     * Will enqueue required assets in the post based on block attributes
     */

    public function enqueue()
    {

        $spam_protections_on_post = $this->get_page_forms($this->blocks, 'spamProtections', []);

        // some default tests

        $recaptcha_test = $this->test_attributes($spam_protections_on_post, function ($attr) {

            $res = false;

            if (is_array($attr)) {

                foreach ($attr as $spam_protection) :

                    $title = array_key_exists('title', $spam_protection) ? $spam_protection['title'] : '';

                    if ($title === 'ReCaptcha v2') :

                        $res = true;

                    endif;


                endforeach;
            }

            return $res;
        });

        if ($recaptcha_test) {
            wp_enqueue_script('gutenberg_forms-recaptcha-render-script', plugins_url('/', __FILE__) . 'scripts/recaptcha-render.js', array('jquery'), 'latest', true);
            wp_enqueue_script('gutenberg_forms-recaptcha', "https://www.google.com/recaptcha/api.js", array('gutenberg_forms-recaptcha-render-script'), '', true);
        }
    }
}
