/***
 * @description Adds Templates Library Trigger in Gutenberg More Menu Dropdown
 */

/**
 *
 * Wordpress Dependencies
 *
 */

import { registerPlugin } from '@wordpress/plugins'
import { PluginSidebarMoreMenuItem } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'

/**
 *
 * Custom Imports
 *
 */
import { TEXT_DOMAIN } from '../../global'
import Icon from '../../assets/icons'

registerPlugin('extendify-temps-more-menu-trigger', {
    render: compose([
        withSelect((select) => {
            const { getLibraryPreviewStatus } = select('extendify-templates/data')

            return {
                previewStatus: getLibraryPreviewStatus(),
            }
        }),
        withDispatch((dispatch, { previewStatus }) => {
            const { setLibraryPreviewStatus } = dispatch('extendify-templates/data')

            return {

                /**
                 *
                 * Will toggle the templates library preview status
                 *
                 */

                toggleTemplatesLibraryPreview() {
                    setLibraryPreviewStatus(!previewStatus)
                },
            }
        }),
    ])(({ previewStatus, toggleTemplatesLibraryPreview }) => (
        <PluginSidebarMoreMenuItem
            isPrimary={previewStatus}
            onClick={toggleTemplatesLibraryPreview}
            className="etfy-lib-menu"
            icon={
                <span className="components-menu-items__item-icon">
                    <Icon icon="library" />
                </span>
            }
        >
            {__('Library', TEXT_DOMAIN)}
        </PluginSidebarMoreMenuItem>
    )),
})
