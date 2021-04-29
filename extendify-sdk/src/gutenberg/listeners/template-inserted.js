import { Templates } from '../api'

export const templateHandler = {
    register() {
        window.addEventListener('extendify-sdk::template-inserted', (event) => {
            Templates.import(event.detail?.template)
        })
    },
}
