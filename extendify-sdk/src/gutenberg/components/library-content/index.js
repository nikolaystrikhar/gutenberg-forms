/**
 *
 * Custom Imports
 *
 */

import Template from '../library-template/index'
import TemplatePreview from '../library-template-preview/index'
import LoadMoreFilter from '../library-load-more/index'
import classnames from 'classnames'
import NotFound from '../library-not-found/index'

/**
 *
 * Wordpress Dependencies
 *
 */

import { compose } from '@wordpress/compose'
import { Spinner } from '@wordpress/components'
import { withSelect } from '@wordpress/data'
import {
    isEmpty, get, head, 
} from 'lodash'

function TemplatesLibraryContent({ templates, shouldPreviewTemplate, loadingStatus, currentCategory }) {
    const classes = classnames({
        'etfy-templates-library-content': true,
        'etfy-templates-library-grid': !shouldPreviewTemplate, // because grid should only be applied when templates display
    })

    const rootClasses = classnames({
        'etfy-templates-library-content-root': true,
        'etfy-templates-loading': loadingStatus,
    })

    const templateRecords = get(templates, 'records')

    const TemplatesGrid = () =>
        !isEmpty(templateRecords)
            ? templateRecords.map((template, index) => <Template key={index} template={template} />)
            : null

    return (
        <div className={rootClasses}>
            {!shouldPreviewTemplate && !loadingStatus && (
                <div className="etfy-templates-description--small">
                    <h3>
                        Templates<span>|</span>
                        {head(currentCategory)}
                    </h3>
                </div>
            )}
            {isEmpty(templateRecords) && !loadingStatus && <NotFound />}
            <div className={classes}>
                {!loadingStatus
                    ? !shouldPreviewTemplate
                        ? <TemplatesGrid />
                        : <TemplatePreview />
                    : null}
                {loadingStatus && (
                    <div className="etfy-loading">
                        <Spinner />
                    </div>
                )}
            </div>
            {!shouldPreviewTemplate && !loadingStatus && <LoadMoreFilter />}
        </div>
    )
}

export default compose([
    withSelect((select) => {
        const { getTemplates, getCurrentPreviewTemplate, getLoadingStatus, getAppliedFilter } = select('extendify-templates/data')

        return {
            templates: getTemplates(),
            shouldPreviewTemplate: !isEmpty(getCurrentPreviewTemplate()),
            loadingStatus: getLoadingStatus('templates'),
            currentCategory: getAppliedFilter('categories'),
        }
    }),
])(TemplatesLibraryContent)
