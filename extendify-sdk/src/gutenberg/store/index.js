/**
 *
 * Wordpress Dependencies
 *
 */

import { registerStore } from '@wordpress/data'

/**
 *
 *  Custom Imports
 *
 */

import rootReducer from './reducer/index'
import actions from './actions/index'
import selectors from './selectors/index'
import resolvers from './resolvers/index'
import controls from './controls/index'

// configuring custom store
const STORE_NAME = 'extendify-templates/data'

/**
 * Block editor data store configuration.
 *
 * @see https://github.com/WordPress/gutenberg/blob/master/packages/data/README.md#registerStore
 *
 * @type {Object}
 */

const storeConfig = {
    reducer: rootReducer,
    actions,
    selectors,
    resolvers,
    controls,
}

const store = registerStore(STORE_NAME, storeConfig)

export default store
