/**
 *
 * Wordpress Dependencies
 *
 */

import { __ } from '@wordpress/i18n'
import { Flex } from '@wordpress/components'
import { withSelect } from '@wordpress/data'
import { compose } from '@wordpress/compose'

/**
 *
 * Custom Imports
 *
 */

import { TEXT_DOMAIN } from '../../global/'

function LibraryImportsCounter({ maxImports, currentImports }) {
    return (
        <Flex className="etfy-imports-counter" justify="flex-start">
            <h4>{__('Imports Left:', TEXT_DOMAIN)}</h4>
            <span>{`${currentImports} / ${maxImports}`}</span>
        </Flex>
    )
}

export default compose([
    withSelect(() => {
        const { getMaxImports, getCurrentImports } = window.wp.data.select('extendify-templates/data')

        return {
            maxImports: getMaxImports(),
            currentImports: getCurrentImports(),
        }
    }),
])(LibraryImportsCounter)
