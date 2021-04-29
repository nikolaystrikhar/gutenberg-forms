import {
    get, isString, has,
} from 'lodash'

/***
 *
 * Templates Library Store Selectors
 *
 */

const selectors = {

    /**
     * Get Current Preview Status of Templates Library
     */

    getLibraryPreviewStatus(state) {
        return get(state, 'previewStatus')
    },

    /**
     * Fetches Templates From API
     */

    getTemplates(state) {
        return get(state, 'templates')
    },

    /**
     *
     * Will return loading status of the state
     * matching the given key
     *
     */

    getLoadingStatus(state, key) {
        switch (key) {
            case 'templates':
                return get(state, 'templates.loading')

            default:
                return false
        }
    },

    /**
     * @return {string[]} available template types
     */
    getTemplateTypes(state) {
        return get(state, 'templateTypes')
    },

    /**
     * Will return the current applied template
     * @param {string} key - Filter to return
     * @return {any} requiredFilter
     */

    getAppliedFilter(state, key) {
        if (!isString(key)) {
            return
        }

        const currentFilters = get(state, 'templateFilters')

        if (!has(currentFilters, key)) {
            return false
        }

        return get(currentFilters, key)
    },

    /**
     * Will provide all currently applied filters
     *
     * @return {object} filters
     */

    getAppliedFilters(state) {
        return get(state, 'templateFilters')
    },

    /**
     * @return {object} currently previewing template
     */

    getCurrentPreviewTemplate(state) {
        return get(state, 'currentPreviewTemplate')
    },

    getCurrentScreen(state) {
        return get(state, 'currentScreen')
    },

    /**
     *
     * @return {string} apiKey
     *
     */

    getApiKey(state) {
        return get(state, 'apiKey')
    },

    /**
     *
     * @return {number} currentImports
     *
     */

    getCurrentImports(state) {
        return get(state, 'currentImports')
    },

    /**
     *
     * @return {number} maxImports
     *
     */

    getMaxImports(state) {
        return get(state, 'maxImports')
    },

    /**
     *
     * @return {boolean} authenticationStatus
     *
     */

    getAuthenticationStatus(state) {
        return get(state, 'apiKey')
            ? true
            : false
    },
}

export default selectors
