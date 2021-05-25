export const initialState = {
    previewStatus: false,
    entryPoint: '',
    templates: {
        loading: false,
        error: false,
        records: [],
        offset: '',
    },
    templateTypes: ['pattern', 'template'],
    templateFilters: {
        categories: [],
        type: 'pattern',
        search: '',
    },
    currentPreviewTemplate: {},
    currentScreen: 'menu',
    reloadRequirements: {
        required: false,
        insertCurrentTemplate: false,
    },
    apiKey: localStorage.getItem('etfy_library__key') ?? '',
    maxImports: 3,
    currentImports: localStorage.getItem('etfy__library_imports_left') ?? 3,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_LIBRARY_PREVIEW_STATUS':
        {
            return {
                ...state,
                previewStatus: action.status,
            }
        }

        case 'SET_TEMPLATES':
        {
            return {
                ...state,
                templates: {
                    ...state.templates,
                    ...action.templates,
                },
            }
        }

        case 'SET_PREVIEW_TEMPLATE':
        {
            return {
                ...state,
                currentPreviewTemplate: action.template,
            }
        }

        case 'SET_FILTERS':
        {
            return {
                ...state,
                templateFilters: {
                    ...state.templateFilters,
                    ...action.filters,
                },
            }
        }

        case 'SET_LOADING_STATUS':
        {
            switch (action.key) {
                case 'templates':
                    return {
                        ...state,
                        templates: {
                            ...state.templates,
                            loading: action.status,
                        },
                    }
            }
            break
        }

        case 'SET_SCREEN':
        {
            return {
                ...state,
                currentScreen: action.screen,
            }
        }

        case 'SET_RELOAD_REQUIREMENTS': {
            return {
                ...state,
                reloadRequirements: action.reload,
            }
        }

        case 'SET_KEY':
        {
            return {
                ...state,
                apiKey: action.key,
            }
        }

        case 'SET_STATE':
            return action.state

        case 'SET_IMPORTS': {
            return {
                ...state,
                currentImports: action.imports,
            }
        }

        case 'SET_ENTRY_POINT': {
            return {
                ...state,
                entryPoint: action.entryPoint,
            }
        }

        default:
            return state
    }
}
