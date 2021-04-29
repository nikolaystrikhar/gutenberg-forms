import { Button, withNotices } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { TEXT_DOMAIN } from '../../global'
import { withState, compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'
import ImportsCounter from '../library-imports-counter'
import ApiForm from './api-form'

function LibraryAuth({ displayApiForm, setState, noticeOperations, noticeUI, isAuthenticated }) {
    const toggleApiForm = () => setState({
        displayApiForm: !displayApiForm,
    })

    return (
        <div className="etfy-library-auth">
            <div className="etfy-library-auth-notices">{noticeUI}</div>
            {!isAuthenticated
                ? (
                    <>
                        <ImportsCounter />
                        <div className="etfy-library-auth__header">
                            <Button
                                className="etfy-upgrade__btn"
                                href={'https://extendify.com/?utm_source=sdk&utm_medium=free_beta&utm_campaign=sdk_ref'}
                                target="__blank"
                            >
                                {__('Sign up for free', TEXT_DOMAIN)}
                            </Button>
                            <Button className="etfy-add-key__btn" onClick={toggleApiForm}>
                                {displayApiForm
                                    ? __('Close')
                                    : __('Log in')}
                            </Button>
                        </div>
                        {displayApiForm && (
                            <ApiForm
                                onError={() =>
                                    noticeOperations.createErrorNotice(__('You have entered an invalid API key', TEXT_DOMAIN))
                                }
                                onSuccess={() =>
                                    noticeOperations.createNotice({
                                        content: __('Activation key added successfully!', TEXT_DOMAIN),
                                        status: 'success',
                                    })
                                }
                            />
                        )}
                    </>
                )
                : null}
        </div>
    )
}

export default compose([
    withNotices,
    withState({
        displayApiForm: false,
    }),
    withSelect((select) => {
        const { getAuthenticationStatus } = select('extendify-templates/data')

        return {
            isAuthenticated: getAuthenticationStatus(),
        }
    }),
])(LibraryAuth)
