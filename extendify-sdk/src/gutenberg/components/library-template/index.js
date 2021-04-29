/**
 *
 * Should Be used for displaying single template
 * fetched from API
 *
 */

/**
 *
 * Wordpress Dependencies
 *
 */

import { isEqual, get } from 'lodash'
import { compose } from '@wordpress/compose'
import { ENTER } from '@wordpress/keycodes'
import {
    Card, CardMedia, TabbableContainer,
} from '@wordpress/components'
import { withSelect, withDispatch } from '@wordpress/data'

/**
 *
 * Custom Imports
 *
 */
import classnames from 'classnames'

function LibraryTemplate({ template, onSelect, currentType }) {
    // destructing template data
    const [url, title, categories] = [
        get(template, 'fields.screenshot[0].url'),
        get(template, 'fields.title'),
        get(template, 'fields.categories'),
    ]

    const templateClass = classnames({
        'etfy-template': true,
        [`etfy-type-${currentType}`]: true,
    })

    return (
        <TabbableContainer
            tabIndex="0"
            aria-pressed="false"
            onClick={onSelect}
            onKeyDown={(e) => isEqual(e.keyCode, ENTER) && onSelect()}
            className="etfy-template-main"
        >
            <Card className={templateClass}>
                <CardMedia className="etfy-template-media" style={{
                    backgroundImage: `url(${url})`,
                }} />
            </Card>
            <div className="etfy-template-body">
                <h2>{title}</h2>
                <span>{categories.join(', ')}</span>
            </div>
        </TabbableContainer>
    )
}

export default compose([
    withSelect((select, { template }) => {
        const shortCode = get(template, 'fields.code')
        const { getAppliedFilter } = select('extendify-templates/data')

        return {
            shortCode,
            currentType: getAppliedFilter('type'),
        }
    }),
    withDispatch((dispatch, { template }) => {
        const { setCurrentPreviewTemplate, setCurrentScreen } = dispatch('extendify-templates/data')

        return {

            /**
             * Will set the current template for preview
             * @return {void}
             */

            onSelect() {
                setCurrentPreviewTemplate(template)
                setCurrentScreen('single-template')
            },
        }
    }),
])(LibraryTemplate)
