<?php

/**
 * Class Submissions
 * @property $submission the current submission which is going to be submitted in the cpt
 */

class Submissions {

	var $cpt_slug = "cwp_gutenberg_forms";

	static function save_record( $fields ) {
		var_dump( $fields );
	}
}
