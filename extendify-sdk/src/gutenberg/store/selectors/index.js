import {
    get, isString, has,
} from 'lodash'

const selectors = {
    getLibraryPreviewStatus(state) {
        return get(state, 'previewStatus')
    },
    getTemplates(state) {
        return get(state, 'templates')
    },
    getLoadingStatus(state, key) {
        switch (key) {
            case 'templates':
                return get(state, 'templates.loading')

            default:
                return false
        }
    },
    getTemplateTypes(state) {
        return get(state, 'templateTypes')
    },
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
    getAppliedFilters(state) {
        return get(state, 'templateFilters')
    },
    getCurrentPreviewTemplate(state) {
        return get(state, 'currentPreviewTemplate')
    },
    getCurrentScreen(state) {
        return get(state, 'currentScreen')
    },
    getApiKey(state) {
        return get(state, 'apiKey')
    },
    getEntryPoint(state) {
        return get(state, 'entryPoint')
    },
    getCurrentImports(state) {
        return get(state, 'currentImports')
    },
    getMaxImports(state) {
        return get(state, 'maxImports')
    },
    getAuthenticationStatus(state) {
        return get(state, 'apiKey')
            ? true
            : false
    },
}

export default selectors
