<?php

function status()
{

    $post_id = get_the_ID();
    $status = get_post_meta($post_id, "status__$post_type", true);

    echo $status;
}
