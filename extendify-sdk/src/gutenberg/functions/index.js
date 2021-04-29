import {
    isEmpty, isString, toLower, get,
} from 'lodash'
import { dispatch } from '@wordpress/data'

/**
 * Will create query accepted string airtable formula with given fields
 *
 * @return {string} formula
 */

export function createTemplatesFilterFormula(filters) {
    const categories = get(filters, 'categories'),
        search = get(filters, 'search'),
        type = get(filters, 'type')

    const CategoriesFilter =
        isEmpty(categories)
            ? 'TRUE()'
            : categories.map((filter) => `SEARCH("${filter}", {categories}) = 1`).join(',')

    const searchFilter = isEmpty(search)
        ? 'TRUE()'
        : `OR(FIND(LOWER("${search}"), LOWER(title)) != 0, FIND(LOWER("${search}"), LOWER({categories})) != 0)`

    const typeFilter = isEmpty(type)
        ? 'TRUE()'
        : `{type}="${type}"`

    let formula = `IF(AND(${CategoriesFilter}, ${searchFilter}, ${typeFilter}), TRUE())`
    if (isEmpty(searchFilter) && isEmpty(typeFilter) && isEmpty(CategoriesFilter)) {
        formula = ''
    }

    return formula.replace(/\r?\n|\r/g, '')
}

/**
 * Will check if the given string contains the search string
 *
 * @param {string} string
 * @param {string} searchString
 */

export function search(string, searchString) {
    // type validation
    if (!isString(string) || !isString(searchString)) {
        return false
    }

    // changing case
    string = toLower(string)
    searchString = toLower(searchString)

    // comparing
    return -1 !== searchString.indexOf(string)
        ? true
        : false
}

/**
 * Given an array of InnerBlocks templates or Block Objects,
 * returns an array of created Blocks from them.
 * It handles the case of having InnerBlocks as Blocks by
 * converting them to the proper format to continue recursively.
 *
 * @param {Array} innerBlocksOrTemplate Nested blocks or InnerBlocks templates.
 *
 * @return {Object[]} Array of Block objects.
 */
export function createBlocksFromInnerBlocksTemplate(innerBlocksOrTemplate = []) {
    const { createBlock } = window.wp.blocks

    // TODO: This should return the native implementation if available here

    return innerBlocksOrTemplate.map((innerBlock) => {
        const innerBlockTemplate = Array.isArray(innerBlock)
            ? innerBlock
            : [innerBlock.name, innerBlock.attributes, innerBlock.innerBlocks]
        const [name, attributes, innerBlocks = []] = innerBlockTemplate
        return createBlock(
            name, attributes, createBlocksFromInnerBlocksTemplate(innerBlocks),
        )
    })
}

export function hydrateTemplateLibrary(state) {
    const { setSpecificState, setCurrentPreviewTemplate } = dispatch('extendify-templates/data')

    // Reset the state
    setSpecificState(state)

    // Setting this again will trigger any insert middleware
    setCurrentPreviewTemplate(state?.currentPreviewTemplate)
}
export function injectTemplate(template) {
    if (!template) {
        throw Error('Template not found')
    }
    const { insertBlocks } = dispatch('core/block-editor')
    const { parse } = window.wp.blocks
    const parsedTemplate = parse(get(template, 'fields.code'))
    const createdBlocks = createBlocksFromInnerBlocksTemplate(parsedTemplate)
    return insertBlocks(createdBlocks).then(() => {
        window.dispatchEvent(new CustomEvent('extendify-sdk::template-inserted', {
            detail: {
                template,
            },
            bubbles: true,
        }))
    })
}
