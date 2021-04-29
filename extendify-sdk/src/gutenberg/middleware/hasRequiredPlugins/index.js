import { checkIfUserNeedsToInstallPlugins } from '../helpers'
import { RequiredPluginsModal } from './RequiredPluginsModal'
import { render } from '@wordpress/element'
import store from '../../store'

export const hasRequiredPlugins = async (template) => {
    const previousState = store.getState()
    return {
        id: 'hasRequiredPlugins',
        pass: !(await checkIfUserNeedsToInstallPlugins(template)),
        async allow() {},
        async deny() {
            return new Promise((resolve) => {
                render(<RequiredPluginsModal previousState={previousState} />,
                    document.querySelector('#extendify-root'))
                window.addEventListener('extendfy::install-required-complete', () => {
                    resolve()
                })
            })
        },
    }
}
