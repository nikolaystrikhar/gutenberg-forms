<?php

require_once plugin_dir_path( __DIR__ ) . 'triggers/validator.php';


function parse_value( $value ) {

    $is_url = Validator::isURL( trim( $value ) );
    $is_word = count(explode( ' ', $value )) === 1;

    if ( $is_url && $is_word ) {

        return "<a href='$value' target='__blank'>$value</a>";

    } else {

        return $value;
    }


}

function Table( $t, $first_capital = false, $preformat = false ) {


    echo "<table class='widefat message-fields striped'>";
        echo "<tbody>";
    
        foreach ($t as $heading => $value) {

            $table_heading = $first_capital ? ucfirst($heading) : $heading;
            $table_value = $preformat ? '<pre>'.parse_value( $value ).'</pre>' : parse_value( $value ); 

            echo '
            <tr>
                <td><strong>'. $table_heading .'</strong></td>
                <td>' .  $table_value . '</td>
            </tr>';
        }


        echo "</tbody>";
    echo "</table>";
}