<?php


require_once ABSPATH . 'wp-content/plugins/gutenberg-forms/markdown/table.php';


function template() {
    $post_type = "cwp_gf_entries";
    $post_id = get_the_ID();
    $post_meta = get_post_meta( $post_id, "template__$post_type", true );

    if ( $post_meta ) {
         //? where Table is a markdown function which will convert key => value pairs into a table
         echo Table($post_meta , true, true);
    }

}