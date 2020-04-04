<?php

/**
 * @param array $array
 * @param array $keys
 *
 * This function removes certain keys from the associative array
 *
 * @return array
 */

function array_remove_keys($array, $keys) {

	$assocKeys = array();
	foreach($keys as $key) {
		$assocKeys[$key] = true;
	}

	return array_diff_key($array, $assocKeys);
}
