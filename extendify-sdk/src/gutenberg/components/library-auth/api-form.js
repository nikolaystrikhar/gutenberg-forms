/**
 *
 * Wordpress Dependencies
 *
 */

import { TextControl, Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withState, compose } from '@wordpress/compose'
import { withDispatch } from '@wordpress/data'
import { isEmpty, isEqual } from 'lodash'

/**
 *
 * Custom Imports
 *
 */

import { TEXT_DOMAIN } from '../../global'
import classnames from 'classnames'

function ApiForm({ apiKey, setState, setApiKey, loading, error, onSuccess, onError }) {
    const saveKey = () => {
        const fakeKey = '3458290385902375729843'

        // checking if the api key is not empty
        if (isEmpty(apiKey)) return

        setState({
            loading: true, error: false, 
        })

        // faking an api request
        setTimeout(() => {
            if (isEqual(fakeKey, apiKey)) {
                setState({
                    loading: false, error: false, 
                })

                setApiKey(apiKey)
                // saving this key in localStorage
                localStorage.setItem('etfy_library__key', apiKey)

                onSuccess()
            } else {
                setState({
                    loading: false, error: true, 
                })
                onError()
            }
        }, 500)
    }

    return (
        <div className="etfy-auth-api-form">
            <TextControl
                className={classnames({
                    'etfy-auth-field': true,
                    'etfy-auth-error': error,
                })}
                value={apiKey}
                onChange={(newApiKey) => setState({
                    apiKey: newApiKey, 
                })}
                placeholder={__('API Key', TEXT_DOMAIN)}
            />
            <Button isPrimary onClick={saveKey} isBusy={loading}>
                {loading
                    ? __('Activating', TEXT_DOMAIN)
                    : __('Activate', TEXT_DOMAIN)}
            </Button>
        </div>
    )
}

export default compose([
    withState({
        apiKey: '',
        loading: false,
        error: false,
    }),
    withDispatch((dispatch) => {
        const { setApiKey } = dispatch('extendify-templates/data')

        return {
            setApiKey,
        }
    }),
])(ApiForm)
