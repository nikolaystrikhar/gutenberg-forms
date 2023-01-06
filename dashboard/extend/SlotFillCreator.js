/**
 * Inserter will just act as an anonymous parent wrapper for inserting child components
 * can be used to extend dashboard features
 */

import React from 'react';
import { createSlotFill } from '@wordpress/components';

export function SlotFillCreator(fill_name) {
	const modified_fill_name = 'gf_extend_'.concat(fill_name);
	const { Fill, Slot } = createSlotFill(modified_fill_name);

	return {
		Fill,
		Slot,
	};
}
