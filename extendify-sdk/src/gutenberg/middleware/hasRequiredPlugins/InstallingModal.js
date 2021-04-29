import { __ } from '@wordpress/i18n'
import {
    Modal, Button, Notice,
} from '@wordpress/components'
import { TEXT_DOMAIN } from '../../global'
import {
    useEffect, useState, render,
} from '@wordpress/element'
import store from '../../store'
import { Plugins } from '../../api'
import { RequiredPluginsModal } from './RequiredPluginsModal'

export const InstallingModal = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const previousState = store.getState()
    delete previousState.templates
    useEffect(() => {
        previousState.reloadRequirements.insertCurrentTemplate = 1
        const sessionState = errorMessage.length
            ? null
            : JSON.stringify(previousState)
        window.sessionStorage.setItem('extendify-sdk-reload-session', sessionState)
    }, [errorMessage, previousState])

    const goBack = () => {
        render(<RequiredPluginsModal previousState={previousState} />, document.querySelector('#extendify-root'))
    }

    Plugins.installAndActivate(previousState?.currentPreviewTemplate?.fields?.required_plugins)
        .then(() => {
            window.dispatchEvent(new CustomEvent('extendfy::install-required-complete'))
        })
        .catch(({ response }) => {
            setErrorMessage(response.data.message)
        })

    return errorMessage
        ? (
            <>
                <Modal
                    style={{
                        maxWidth: '500px',
                    }}
                    title={__('Error installing plugins', TEXT_DOMAIN)}
                    isDismissible={false}
                >
                    {__('You have encountered an error that we cannot recover from. Please try again.', TEXT_DOMAIN)}
                    <br />
                    <Notice isDismissible={false} status="error">
                        {errorMessage}
                    </Notice>
                    <Button isPrimary onClick={goBack}>
                        {__('Go back', TEXT_DOMAIN)}
                    </Button>
                </Modal>
            </>
        )
        : (
            <>
                <Modal title={__('Installing plugins', TEXT_DOMAIN)} isDismissible={false}>
                    <Button style={{
                        width: '100%',
                    }} disabled isPrimary isBusy onClick={() => {}}>
                        {__('Installing...', TEXT_DOMAIN)}
                    </Button>
                </Modal>
            </>
        )
}
