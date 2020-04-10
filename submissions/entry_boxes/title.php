<?php

function title() {

    $post = get_post( get_the_ID() );

    echo $post->post_title;


}