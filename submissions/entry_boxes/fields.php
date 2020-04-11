<?php 


require_once plugin_dir_path( plugin_dir_path( __DIR__ ) ) . '/markdown/table.php';


function fields() {


    $post_type = "cwp_gf_entries";
    $post_id = get_the_ID();
    $post_meta = get_post_meta( $post_id, "fields__$post_type", true );

    if ($post_meta) {

        //? where Table is a markdown function which will convert key => value pairs into a table
        echo Table($post_meta);
    }
}   