/**
 *
 * Wordpress Dependencies
 *
 */

import { TextControl } from '@wordpress/components'
import { __experimentalSearchForm as SearchForm } from '@wordpress/block-editor'
import { noop, isFunction } from 'lodash'

/**
 * External dependencies
 */

import classnames from 'classnames'

function TemplatesLibrarySearchForm({ className, onChange, value, placeholder, onKeyDown = noop }) {
    return (
        <div className={classnames('block-editor-inserter__search', className)}>
            {isFunction(SearchForm)
                ? (
                    <SearchForm
                        placeholder={placeholder}
                        onChange={(newSearch) => onChange(newSearch)}
                        autoComplete="off"
                        value={value || ''}
                    />
                )
                : (
                    <TextControl
                        style={{
                            padding: '8px 8px',
                        }}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        value={value}
                        autoComplete="off"
                    />
                )}
        </div>
    )
}

export default TemplatesLibrarySearchForm
