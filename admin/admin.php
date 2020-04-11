<?php

class cwp_gutenberg_forms_Page {


	public function __construct() {
    
        add_action( 'admin_menu', array( $this, 'cwp_gutenberg_forms' ) );
    }
    

	public function cwp_gutenberg_forms() {
        
        
        $page_title = 'Gutenberg Forms Dashboard';
		$menu_title = 'Gutenberg Forms';
		$capability =
		 'manage_options';
		$slug = 'gutenberg_forms';
		$callback = array($this, 'cwp_gutenberg_forms_content');
        $icon_url = 'dashicons-feedback';
        
		add_menu_page($page_title, $menu_title, $capability, $slug, $callback, $icon_url, 25);
        add_submenu_page('gutenberg_forms', 'Form', 'Forms', 'manage_options',  'edit.php?post_type=cwp_gf_forms'); 
        add_submenu_page('gutenberg_forms', 'Entry', 'Entries', 'manage_options', 'edit.php?post_type=cwp_gf_entries'); 
		
    }
    

	public function cwp_gutenberg_forms_content() {
	?>
       
	   <div class="cwp-gf-settings-wrap">
    <div class="components-panel">
        <div class="components-panel__body is-opened">
            <div class="components-panel__header">
                <h2>Getting Started with <strong>Gutenberg Forms</strong><code>1.2.0</code></h2>
                <p>Congratulations! You've just added awesome Gutenberg blocks. Check more information about the plugin below. ACF Blocks is built on top of ACF Pro, please make sure you have ACF Pro plugin installed & activated to use ACF Blocks Free.</p>
                <iframe width="650" height="380" src="https://www.youtube.com/embed/zupr0fl_qAw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="cwp_gf_admin_btn_wrap">
                    <a href="https://github.com/munirkamal/gutenberg-forms" target="__blank" class="cwp-gf_admin_button">Github</a>
					<a href="https://wordpress.org/support/plugin/forms-gutenberg/" target="__blank" class="cwp-gf_admin_button">Support</a>
				</div>
            </div>
        </div>
    </div>
</div>

	<?php
	}
}

new cwp_gutenberg_forms_Page();