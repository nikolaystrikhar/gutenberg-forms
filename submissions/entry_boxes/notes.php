<?php

function notes()
{
    $post_type = "cwp_gf_entries";
    $post_id = get_the_ID();
    $post_meta = get_post_meta($post_id, "notes__$post_type", true);

    echo $post_meta;
}
