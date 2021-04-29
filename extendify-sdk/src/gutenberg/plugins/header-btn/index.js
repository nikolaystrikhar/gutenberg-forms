/**
 *
 * @description Renders Template Library Trigger in Gutenberg Editor Header
 *
 */

/**
 *
 * Wordpress Dependencies
 *
 */

import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import { renderToString } from '@wordpress/element'

/**
 *
 * Custom Dependencies
 *
 */

import { TEXT_DOMAIN } from '../../global'
import Icon from '../../assets/icons'

function insertHeaderButton() {
    // just to keep it cleaner - we refer to our link by id for speed of lookup on DOM.
    var link_id = 'extendify-templates-inserter-btn'

    // prepare our custom link's html.
    var link_html =
        '<div id="extendify-templates-inserter"><button type="button" id="' +
        link_id +
        '" class="components-button">' +
        renderToString(<Icon icon="library" />) +
        __('Library', TEXT_DOMAIN) +
        '</button></div>'

    // check if gutenberg's editor root element is present.
    var editorEl = document.getElementById('editor')
    if (!editorEl) {
        // do nothing if there's no gutenberg root element on page.
        return
    }

    window.wp.data.subscribe(function () {
        setTimeout(function () {
            if (!document.getElementById(link_id)) {
                var toolbalEl = editorEl.querySelector('.edit-post-header-toolbar')
                if (toolbalEl instanceof HTMLElement) {
                    toolbalEl.insertAdjacentHTML('beforeend', link_html)

                    // hooking the template library toggle event
                    document.querySelector('#' + link_id).addEventListener('click', function () {
                        const { setLibraryPreviewStatus } = dispatch('extendify-templates/data')

                        setLibraryPreviewStatus(true)
                    })
                }
            }
        }, 1)
    })
}

window.wp.domReady(insertHeaderButton)
