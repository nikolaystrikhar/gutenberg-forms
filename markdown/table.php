<?php

function Table( $t, $first_capital = false ) {


    echo "<table class='widefat'>";
        echo "<tbody>";
    
        foreach ($t as $heading => $value) {

            $table_heading = $first_capital ? ucfirst($heading) : $heading; 

            echo '
            <tr>
                <td><strong>' . $table_heading . '</strong></td>
                <td>' .  $value . '</td>
            </tr>';
        }


        echo "</tbody>";
    echo "</table>";
}