/**
 *
 * Wordpress Dependencies
 *
 */

import { compose } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

/**
 *
 * Custom Imports
 *
 */

function NotFound({ currentSearch }) {
    return (
        <div className="etfy-not-results-found__root">
            <h2>{__(`Your search "${currentSearch}" - did not match any designs.`)}</h2>
            <p>{__('Try searching again or select one of the categories from the list on the left.')}</p>
        </div>
    )
}

export default compose([
    withSelect((select) => {
        const { getAppliedFilter } = select('extendify-templates/data')

        return {
            currentSearch: getAppliedFilter('search'),
        }
    }),
    withDispatch(() => {
        return {}
    }),
])(NotFound)
