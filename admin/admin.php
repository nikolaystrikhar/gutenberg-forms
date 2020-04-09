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
        add_submenu_page('gutenberg_forms', 'Form', 'Forms', 'manage_options', 'edit.php?post_type=cwp_gf_forms'); 
        add_submenu_page('gutenberg_forms', 'Entry', 'Entries', 'manage_options', 'edit.php?post_type=cwp_gf_entries'); 
		
    }
    

	public function cwp_gutenberg_forms_content() {
	?>
        <div id="cwp_gutenberg_forms_root"></div>
	<?php
	}
}

new cwp_gutenberg_forms_Page();