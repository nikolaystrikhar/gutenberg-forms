/**
 *
 * Wordpress Dependencies
 *
 */

import { compose, withState } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { TEXT_DOMAIN } from '../../global/index'
import { withSelect, withDispatch } from '@wordpress/data'
import { Button } from '@wordpress/components'
import {
    get, map, isEqual, head,
} from 'lodash'
import { injectTemplate } from '../../functions'
import { Middleware, AuthorizationCheck } from '../../middleware'
import { useState, useEffect } from '@wordpress/element'

function TemplateLibraryPreview({ template, onImport, applyCategory, setState, currentImports, isAuthenticated }) {
    // destructuring current template
    const [url, title, categories, requiredPlugins] = [
        get(template, 'fields.screenshot[0].url'),
        get(template, 'fields.title'),
        get(template, 'fields.categories'),
        get(
            template, 'fields.required_plugins', [],
        ),
    ]
    const canImport = 0 < currentImports
    const canImportMiddleware = Middleware(['hasRequiredPlugins', 'hasPluginsActivated', 'needsPageReload'])
    const [ready, setReady] = useState(false)
    useEffect(() => {
        canImportMiddleware.check(template).then(() => {
            setState({
                restrictions: canImportMiddleware.stack,
            })
            setReady(true)
        })
        return () => {
            canImportMiddleware.reset()
            setReady(false)
        }
        // TODO: optimize this?
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template])

    return template ?
        (
            <div className="etfy-template-preview">
                <div className="etfy-template-media">
                    <img src={url} />
                </div>
                <div className="etfy-template-details">
                    {/* TODO Needs refactoring */}
                    {ready
                        ? (
                            <>
                                {!canImport && !isAuthenticated && (
                                    <Button className="etfy-upgrade-btn" href={'https://extendify.com/?utm_source=sdk&utm_medium=free_beta_2&utm_campaign=sdk_ref'} target="__blank">
                                        {__('Sign up for free to add', TEXT_DOMAIN)}
                                    </Button>
                                )}
                                {(isAuthenticated || canImport) && (
                                    <Button isPrimary onClick={onImport}>
                                        {__('Add', TEXT_DOMAIN)}
                                    </Button>
                                )}
                            </>
                        )
                        : (
                            <Button disabled>{__('Loading...', TEXT_DOMAIN)}</Button>
                        )}

                    <div>
                        <h2 className="etfy-template-title">{title}</h2>
                        <div className="etfy-template-categories">
                            {map(categories, (category, index) => (
                                <Button
                                    isLink
                                    key={index}
                                    className="etfy-template-category"
                                    onClick={() => applyCategory(category)}
                                >
                                    {__(category, TEXT_DOMAIN)}
                                </Button>
                            ))}
                        </div>
                        {requiredPlugins.length ?
                            (
                                <>
                                    <hr />
                                    <div className="etfy-template-required-plugins">
                                        <strong>Plugins required: </strong>
                                        <ul style={{
                                            display: 'inline',
                                        }}>
                                            {map(requiredPlugins, (_plugin, index) => (
                                                <li style={{
                                                    display: 'inline',
                                                }} key={index}>
                                                    {/* TODO: This is hardcoded until we define a better way to manage plugin dependecies via Airtable! */}
                                                    {__('Editor Plus', TEXT_DOMAIN)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )
                            : null}
                    </div>
                </div>
            </div>
        )
        : null
}

export default compose([
    withState({
        restrictions: [],
    }),
    withSelect((select) => {
        const {
            getCurrentPreviewTemplate,
            getAppliedFilter,
            getCurrentImports,
            getMaxImports,
            getAuthenticationStatus,
        } = select('extendify-templates/data')
        const { getEditedPostAttribute } = select('core/editor')

        const template = getCurrentPreviewTemplate()
        const shortCode = get(template, 'fields.code')

        return {
            template: getCurrentPreviewTemplate(),
            currentCategory: getAppliedFilter('categories'),
            shortCode,
            postMeta: getEditedPostAttribute('meta'),
            currentImports: getCurrentImports(),
            maxImports: getMaxImports(),
            isAuthenticated: getAuthenticationStatus(),
        }
    }),
    withDispatch((dispatch, { currentCategory, template, currentImports, restrictions }) => {
        const {
            setFilters,
            setCurrentScreen,
            setCurrentPreviewTemplate,
            setLibraryPreviewStatus,
            setImportsCount,
        } = dispatch('extendify-templates/data')

        return {
            onImport() {
                AuthorizationCheck(restrictions).then(() => {
                    setLibraryPreviewStatus(false)
                    injectTemplate(template).then(() => {
                        const { createNotice } = dispatch('core/notices')
                        // updating imports count
                        const newImportsCount = currentImports - 1
                        setImportsCount(newImportsCount)
                        localStorage.setItem('etfy__library_imports_left', newImportsCount)

                        createNotice(
                            'info', __('Template Added'), {
                                isDismissible: true,
                                type: 'snackbar',
                            },
                        )
                    })
                })
            },

            /**
             * Will apply the given category and removes the currently
             * preview template
             * @param {string} category
             */
            applyCategory(category) {
                if (!isEqual(category, head(currentCategory))) {
                    // re fetches if the new category is selected
                    setFilters({
                        categories: [category],
                    })
                }

                setCurrentPreviewTemplate({})
                setCurrentScreen('templates')
            },
        }
    }),
])(TemplateLibraryPreview)
