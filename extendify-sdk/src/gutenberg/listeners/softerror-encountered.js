import { camelCase } from 'lodash'
import { RequiredPluginsModal } from '../middleware/hasRequiredPlugins/RequiredPluginsModal'
import { ReloadRequiredModal } from '../middleware/needsPageReload/ReloadRequiredModal'
import { render } from '@wordpress/element'

export const softErrorHandler = {
    register() {
        window.addEventListener('extendify-sdk::softerror-encountered', (event) => {
            this[camelCase(event.detail.type)](event.detail)
        })
    },
    versionOutdated(error) {
        render(<RequiredPluginsModal
            title={error.data.title}
            message={error.data.message}
            buttonLabel={error.data.buttonLabel}
            forceOpen={true}
        />,
        document.querySelector('#extendify-root'))

        // Listen for activation complete, then open the reload modal
        window.addEventListener('extendfy::install-required-complete', async () => {
            window.sessionStorage.removeItem('extendify-sdk-reload-session')
            await new Promise((resolve) => setTimeout(resolve, 1500))
            render(<ReloadRequiredModal />, document.querySelector('#extendify-root'))
        })
    },
}
