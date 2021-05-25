import { __ } from '@wordpress/i18n'
import { renderToString } from '@wordpress/element'
import { TEXT_DOMAIN } from './config'
import { registerPlugin } from '@wordpress/plugins'
import { PluginSidebarMoreMenuItem } from '@wordpress/edit-post'

const openLibrary = (event) => {
    window.dispatchEvent(new CustomEvent('extendify-sdk::open-library', {
        detail: event.target.closest('[data-extendify-identifier]')?.dataset?.extendifyIdentifier ?? 'not-set',
        bubbles: true,
    }))
}

const mainButton = <div id="extendify-templates-inserter">
    <button
        style="background:#D9F1EE;color:#1e1e1e;border:1px solid #949494;font-weight:bold;font-size:14px;padding:8px;margin-right:8px"
        type="button"
        data-extendify-identifier="main-button"
        id="extendify-templates-inserter-btn"
        className="components-button">
        <svg style="margin-right:0.5rem" width="20" height="20" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="25.75" width="70.8125" height="77.25" fill="#000000"/>
            <rect x="45.0625" width="57.9375" height="57.9375" fill="#37C2A2"/>
        </svg>
        {__('Library', TEXT_DOMAIN)}
    </button>
</div>

// Add the button when Gutenberg is available and ready
document.getElementById('editor') && window.wp.data.subscribe(() => {
    setTimeout(() => {
        if (document.getElementById('extendify-templates-inserter-btn')) {
            return
        }
        if (!document.querySelector('.edit-post-header-toolbar')) {
            return
        }
        document.querySelector('.edit-post-header-toolbar').insertAdjacentHTML('beforeend', renderToString(mainButton))
        document.getElementById('extendify-templates-inserter-btn')
            .addEventListener('click', openLibrary)
    }, 0)
})

// The CTA button inside patterns
document.getElementById('editor') && window.wp.data.subscribe(() => {
    setTimeout(() => {
        if (!document.querySelector('[id$=patterns-view]')) {
            return
        }
        if (document.getElementById('extendify-cta-button')) {
            return
        }
        const ctaButton = <div>
            <button
                id="extendify-cta-button"
                style="margin:1rem 1rem 0"
                data-extendify-identifier="patterns-cta"
                className="components-button is-secondary">
                {__('Discover more patterns in Extendify Library', TEXT_DOMAIN)}
            </button>
        </div>
        document.querySelector('[id$=patterns-view]').insertAdjacentHTML('afterbegin', renderToString(ctaButton))
        document.getElementById('extendify-cta-button').addEventListener('click', openLibrary)
    }, 0)
})

// The right dropdown side menu
const SideMenuButton = () => (<PluginSidebarMoreMenuItem
    data-extendify-identifier="sidebar-button"
    onClick={openLibrary}
    icon={
        <span className="components-menu-items__item-icon">
            <svg width="20" height="20" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="25.75" width="70.8125" height="77.25" fill="#000000"/>
                <rect x="45.0625" width="57.9375" height="57.9375" fill="#37C2A2"/>
            </svg>
        </span>
    }
>
    {__('Library', TEXT_DOMAIN)}
</PluginSidebarMoreMenuItem>)
document.getElementById('editor') && registerPlugin('extendify-temps-more-menu-trigger', {
    render: SideMenuButton,
})
