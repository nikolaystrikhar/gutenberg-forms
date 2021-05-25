import TemplatesLibraryModal from '../../components/library-modal/index'
import { render } from '@wordpress/element'
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { hydrateTemplateLibrary, injectTemplate } from '../../functions'

document.getElementById('editor') && window.wp.domReady(() => {
    // Hydrate the state with the user's last state pre-reload
    const stateHydration = JSON.parse(window.sessionStorage.getItem('extendify-sdk-reload-session'))
    stateHydration && maybeHydrateAndInsertPendingTemplate(stateHydration)

    // Insert into the editor
    const extendify = document.createElement('div')
    extendify.id = 'extendify-root'
    document.querySelector('#editor').insertAdjacentElement('afterend', extendify)
    render(<TemplatesLibraryModal />, extendify)
})

function maybeHydrateAndInsertPendingTemplate(state) {
    window._wpLoadBlockEditor.then(() => {
        // Remove the state from storage
        window.sessionStorage.removeItem('extendify-sdk-reload-session')

        hydrateTemplateLibrary(state)

        // If we need to insert the template on load
        if (state?.reloadRequirements?.insertCurrentTemplate) {
            const { setLibraryPreviewStatus, setImportsCount } = dispatch('extendify-templates/data')
            const { getCurrentImports } = select('extendify-templates/data')
            setLibraryPreviewStatus(false)
            setTimeout(() => {
                state?.currentPreviewTemplate && injectTemplate(state.currentPreviewTemplate).then(() => {
                    const { createNotice } = dispatch('core/notices')
                    const newImportsCount = getCurrentImports() - 1
                    setImportsCount(newImportsCount)
                    localStorage.setItem('etfy__library_imports_left', newImportsCount)
                    createNotice(
                        'info', __('Template Added'), {
                            isDismissible: true,
                            type: 'snackbar',
                        },
                    )
                })
            }, 0)
        }
    })
}
