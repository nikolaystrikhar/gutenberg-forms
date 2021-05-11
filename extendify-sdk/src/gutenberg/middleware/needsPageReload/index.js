import { render } from '@wordpress/element'
import { ReloadRequiredModal } from './ReloadRequiredModal'
import store from '../../store'

export const needsPageReload = async () => {
    const state = store.getState()
    return {
        id: 'needsPageReload',
        pass: !state?.reloadRequirements?.required,
        async allow() {},
        async deny() {
            // This one doesn't resolve since we will force a page reload
            return new Promise(() => {
                render(<ReloadRequiredModal />, document.querySelector('#extendify-root'))
            })
        },
    }
}
