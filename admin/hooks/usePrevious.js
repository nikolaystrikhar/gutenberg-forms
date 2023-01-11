import { useEffect, useRef } from 'react';

/**
 * Will return the previous instance of the given value in the functional component
 * @param {any} value
 */

export function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
