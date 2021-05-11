/**
 *
 * Template Library Actions
 *
 */
// import { initialState } from '../reducer/index'

const actions = {

    /**
     * Will set the given library in the base state
     *
     * @param {object} library
     */

    setLibraryPreviewStatus(status) {
        return {
            type: 'SET_LIBRARY_PREVIEW_STATUS',
            status,
        }
    },

    /**
     * Will update the templates with the given one
     *
     * @param {array} templates
     */

    setTemplates(templates) {
        return {
            type: 'SET_TEMPLATES',
            templates,
        }
    },

    /**
     *
     * Will set the loading status of
     * the given key
     *
     */

    setLoadingStatus(key, status) {
        return {
            type: 'SET_LOADING_STATUS',
            key,
            status,
        }
    },

    /**
     * Will set the given template in the preview
     * @param {object} template
     */

    setCurrentPreviewTemplate(template) {
        return {
            type: 'SET_PREVIEW_TEMPLATE',
            template,
        }
    },

    /**
     * Will set current filters
     * @param {object} filter - Filter object to update
     */

    setFilters(filters) {
        return {
            type: 'SET_FILTERS',
            filters,
        }
    },

    setLastAppliedFilters(filters) {
        return {
            type: 'SET_LAST_APPLIED_FILTERS',
            filters,
        }
    },

    setCurrentScreen(screen) {
        return {
            type: 'SET_SCREEN',
            screen,
        }
    },

    setReloadRequirements(reload) {
        return {
            type: 'SET_RELOAD_REQUIREMENTS',
            reload,
        }
    },

    setSpecificState(state) {
        return {
            type: 'SET_STATE',
            state,
        }
    },

    setApiKey(key) {
        return {
            type: 'SET_KEY',
            key,
        }
    },

    setImportsCount(newImports) {
        return {
            type: 'SET_IMPORTS',
            imports: newImports,
        }
    },
}

export default actions
