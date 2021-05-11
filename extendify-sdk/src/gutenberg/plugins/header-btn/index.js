import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import { renderToString } from '@wordpress/element'
import { TEXT_DOMAIN } from '../../global'

function insertHeaderButton() {
    const extendifyButton = <div id="extendify-templates-inserter">
        <button
            style="background:#D9F1EE;color:#1e1e1e;font-weight:bold;font-size:14px;padding:8px;height:28px"
            type="button"
            id="extendify-templates-inserter-btn"
            className="components-button">
            <svg style="margin-right:0.5rem" width="20" height="20" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="25.75" width="70.8125" height="77.25" fill="black"/>
                <rect x="45.0625" width="57.9375" height="57.9375" fill="#37C2A2"/>
            </svg>
            {__('Library', TEXT_DOMAIN)}
        </button>
    </div>

    // Add the button when Gutenberg is available and ready
    document.getElementById('editor') && window.wp.data.subscribe(function () {
        setTimeout(function () {
            if (document.getElementById('extendify-templates-inserter-btn')) {
                return
            }
            const toolbar = document.querySelector('.edit-post-header-toolbar')
            if (toolbar instanceof HTMLElement) {
                toolbar.insertAdjacentHTML('beforeend', renderToString(extendifyButton))
                document.getElementById('extendify-templates-inserter-btn').addEventListener('click', () => {
                    const { setLibraryPreviewStatus } = dispatch('extendify-templates/data')
                    setLibraryPreviewStatus(true)
                })
            }
        }, 0)
    })
}

window.wp.domReady(insertHeaderButton)
