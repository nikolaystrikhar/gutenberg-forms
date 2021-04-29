import { checkIfUserNeedsToActivatePlugins } from '../helpers'
import { ActivatePluginsModal } from './ActivatePluginsModal'
import { render } from '@wordpress/element'
import store from '../../store'

export const hasPluginsActivated = async (template) => {
    const previousState = store.getState()
    return {
        id: 'hasPluginsActivated',
        pass: !(await checkIfUserNeedsToActivatePlugins(template)),
        async allow() {},
        async deny() {
            return new Promise((resolve) => {
                render(<ActivatePluginsModal previousState={previousState} showClose={true}/>,
                    document.querySelector('#extendify-root'))
                window.addEventListener('extendfy::activate-required-complete', () => {
                    resolve()
                })
            })
        },
    }
}
