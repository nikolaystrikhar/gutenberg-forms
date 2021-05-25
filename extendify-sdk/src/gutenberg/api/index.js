import axios from 'axios'
import Templates from './Templates'
import Plugins from './Plugins'
import Categories from './Categories'

const Axios = axios.create({
    baseURL: window.extendifySdkData.root,
    headers: {
        'X-WP-Nonce': window.extendifySdkData.nonce,
        'X-Requested-With': 'XMLHttpRequest',
        'X-Extendify': true,
    },
})

function findResponse(response) {
    return Object.prototype.hasOwnProperty.call(response, 'data')
        ? response.data
        : response
}

function handleErrors(error) {
    console.error(error.response)
    // TODO: add a global error message system
    return Promise.reject(findResponse(error.response))
}

function addDefaults(request) {
    const { getCurrentImports, getEntryPoint } = window.wp.data.select('extendify-templates/data')
    if (request.data) {
        request.data.remaining_imports = getCurrentImports()
        request.data.entry_point = getEntryPoint()
    }
    return request
}

function checkDevMode(request) {
    request.headers['X-Extendify-Dev-Mode'] = window.location.search.indexOf('DEVMODE') > -1
    return request
}

function checkForSoftError(response) {
    if (Object.prototype.hasOwnProperty.call(response, 'soft_error')) {
        window.dispatchEvent(new CustomEvent('extendify-sdk::softerror-encountered', {
            detail: response.soft_error,
            bubbles: true,
        }))
    }
    return response
}

Axios.interceptors.response.use((response) => checkForSoftError(findResponse(response)),
    (error) => handleErrors(error))

// TODO: setup a pipe function instead of this nested pattern
Axios.interceptors.request.use((request) => checkDevMode(addDefaults(request)),
    (error) => error)

export {
    Axios, Templates, Plugins, Categories,
}
