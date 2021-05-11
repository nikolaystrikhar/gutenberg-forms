/**
 *
 * Wordpress Dependencies
 *
 */

import { __ } from '@wordpress/i18n'
import { MenuItem } from '@wordpress/components'
import { compose, withState } from '@wordpress/compose'
import {
    useRef, useEffect, useState,
} from '@wordpress/element'
import { withSelect, withDispatch } from '@wordpress/data'
import {
    map, isEqual, includes, toLower, capitalize, head, isEmpty, debounce, get,
} from 'lodash'

/**
 *
 * Custom Imports
 *
 */

import { TEXT_DOMAIN } from '../../global'
import Search from '../library-search/index'
import SidebarSection from '../library-sidebar-section/index'
import { search } from '../../functions/index'
import classnames from 'classnames'
import LibraryAuth from '../library-auth'
import { Categories } from '../../api'

function TemplatesLibrarySidebar({
    types,
    setFilters,
    currentType,
    currentSearch,
    currentCategories,
    setCurrentPreviewTemplate,
    searchState,
    setState,
    setCurrentScreen,
    templates,
}) {
    const [categories, setCategories] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const relevantCategories = categories.filter((cat) => search(currentSearch, cat))

    useEffect(() => {
        Categories.getAll()
            .then((data) => setCategories(data))
            .catch(({ message }) => setErrorMessage(message))
    }, [])

    // debouncing search query with 500ms
    const dispatchSearchQuery = useRef(debounce((query) => {
        setFilters({
            search: query, categories: [],
        })
        setCurrentScreen('templates')
        setCurrentPreviewTemplate({})
    }, 500)).current

    const applyCategory = (category) => {
        const clearSearch = get(templates, 'records.length') === 0
            ? true
            : false

        if (clearSearch) {
            setState({
                searchState: '',
            })
        }

        if (currentCategories.includes(category)) {
            setCurrentPreviewTemplate({})
        } else {
            setFilters({
                categories: category
                    ? [category]
                    : [],
                search: clearSearch
                    ? ''
                    : currentSearch,
            })
            setCurrentPreviewTemplate({})
        }

        setCurrentScreen('templates')
    }

    const applyType = (type) => {
        if (isEqual(currentType, type)) {
            setCurrentPreviewTemplate({})
        } else {
            setFilters({
                type,
                categories: currentCategories.length
                    ? [head(currentCategories)]
                    : [],
            })

            setCurrentPreviewTemplate({})
        }
    }

    const CategoriesFilter = (props) => {
        if (errorMessage.length) {
            return errorMessage
        }
        if (!categories.length) {
            return __('Loading categories...', TEXT_DOMAIN)
        }
        return <>
            <MenuItem
                className={classnames({
                    'etfy-selected-category': !currentCategories.length,
                    'etfy-menu-item': true,
                })}
                onClick={() => applyCategory()}
            >
                {__('All', TEXT_DOMAIN)}
            </MenuItem>
            {map(props.categories, (category, index) => {
                const hasCurrentCategory = includes(currentCategories, category)

                // if the current category matches the current search query
                let isSearchRelevant = !isEmpty(currentSearch)
                    ? search(currentSearch, category)
                    : true

                if (get(templates, 'records.length') === 0) {
                    isSearchRelevant = true
                }

                return (
                    isSearchRelevant && (
                        <MenuItem
                            key={index}
                            className={classnames({
                                'etfy-selected-category': hasCurrentCategory,
                                'etfy-menu-item': true,
                            })}
                            onClick={() => applyCategory(category)}
                        >
                            {capitalize(category)}
                        </MenuItem>
                    )
                )
            })}
        </>
    }

    useEffect(() => setState({
        searchState: currentSearch,
        // TODO: optimize this?
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [])

    const shouldShowCategories =
        relevantCategories.length === 0 && get(templates, 'records.length') > 0 && !isEmpty(currentSearch)
            ? false
            : true

    return (
        <div className="etfy-templates-library-sidebar">
            <div className="etfy-templates-library-sidebar__wrapper">
                <div className="etfy-templates-library-top__area">
                    <LibraryAuth />
                    <Search
                        value={searchState}
                        placeholder={__('What are you looking for?', TEXT_DOMAIN)}
                        onChange={(newSearch) => {
                            setState({
                                searchState: newSearch,
                            })
                            dispatchSearchQuery(newSearch)
                        }}
                    />
                    <hr className="etfy-divider" />
                </div>
                <SidebarSection title={__('Type', TEXT_DOMAIN)}>
                    {map(types, (type, index) => (
                        <MenuItem
                            onClick={() => applyType(type)}
                            className={classnames({
                                'etfy-menu-item': true,
                                'etfy-selected-category': isEqual(toLower(type), currentType),
                            })}
                            key={index}
                        >
                            {capitalize(type)}
                        </MenuItem>
                    ))}
                </SidebarSection>
                {shouldShowCategories && (
                    <SidebarSection title={__('Categories', TEXT_DOMAIN)}>
                        <CategoriesFilter categories={categories} type={currentType} />
                    </SidebarSection>
                )}
            </div>
        </div>
    )
}

export default compose([
    withState({
        searchState: '',
    }),
    withSelect((select) => {
        const { getTemplateTypes, getAppliedFilter, getTemplates } = select('extendify-templates/data')

        return {
            types: getTemplateTypes(),
            currentType: getAppliedFilter('type'),
            currentCategories: getAppliedFilter('categories'),
            currentSearch: getAppliedFilter('search'),
            templates: getTemplates(),
        }
    }),
    withDispatch((dispatch) => {
        const { setFilters, setCurrentPreviewTemplate, setCurrentScreen } = dispatch('extendify-templates/data')

        return {
            setFilters, setCurrentPreviewTemplate, setCurrentScreen,
        }
    }),
])(TemplatesLibrarySidebar)
