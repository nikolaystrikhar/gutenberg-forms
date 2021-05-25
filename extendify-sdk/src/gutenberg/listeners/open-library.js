import { dispatch } from '@wordpress/data'

const { setLibraryPreviewStatus, setEntryPoint } = dispatch('extendify-templates/data')
export const openLibrary = {
    register() {
        window.addEventListener('extendify-sdk::open-library', ({ detail }) => {
            setEntryPoint(detail)
            setLibraryPreviewStatus(true)
        })
    },
}
