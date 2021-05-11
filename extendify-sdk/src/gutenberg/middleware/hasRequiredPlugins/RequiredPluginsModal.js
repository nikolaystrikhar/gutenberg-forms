import { __, sprintf } from '@wordpress/i18n'
import { TEXT_DOMAIN } from '../../global'
import TemplatesLibraryModal from '../../components/library-modal/index'
import { dispatch, select } from '@wordpress/data'
import {
    Modal, Button, ButtonGroup,
} from '@wordpress/components'
import { useState } from '@wordpress/element'
import { render } from '@wordpress/element'
import { InstallingModal } from './InstallingModal'

export const RequiredPluginsModal = (props) => {
    const { setSpecificState, setCurrentPreviewTemplate } = dispatch('extendify-templates/data')
    const { getCurrentPreviewTemplate } = select('extendify-templates/data')
    const [isOpen, setOpen] = useState(true)
    const previouslyViewedTemplate = getCurrentPreviewTemplate()

    // Closing the modal will reset the library state
    const closeModal = () => {
        if (props.forceOpen) {
            return
        }
        setOpen(false)
        if (props.previousState) {
            setSpecificState(props.previousState)
            setCurrentPreviewTemplate(previouslyViewedTemplate)
        }
        render(<TemplatesLibraryModal />, document.querySelector('#extendify-root'))
    }

    const installPlugins = async () => {
        setOpen(false)
        render(<InstallingModal />, document.querySelector('#extendify-root'))
    }
    const type = props.previousState?.currentPreviewTemplate?.fields?.type ?? 'template'
    return (
        <>
            {isOpen && (
                <Modal
                    title={props.title ?? __('Install required plugins', TEXT_DOMAIN)}
                    closeButtonLabel={__('No thanks, take me back', TEXT_DOMAIN)}
                    onRequestClose={closeModal}
                >
                    <p style={{
                        maxWidth: '400px',
                    }}>
                        {props.message ?? __(sprintf('There is just one more step. This %s requires the following to be automatically installed:',
                            type),
                        TEXT_DOMAIN)}
                    </p>
                    {/* TODO: leaving this hard coded until we can update the airtable data structure */}
                    {props.message?.length > 0 || <ul>
                        <li>Editor Plus</li>
                    </ul>}
                    <ButtonGroup>
                        <Button isPrimary onClick={installPlugins}>
                            {props.buttonLabel ?? __('Install Plugins', TEXT_DOMAIN)}
                        </Button>
                        {props.forceOpen || <Button isTertiary onClick={closeModal} style={{
                            boxShadow: 'none', margin: '0 4px',
                        }}>
                            {__('No thanks, take me back', TEXT_DOMAIN)}
                        </Button>}
                    </ButtonGroup>
                </Modal>
            )}
        </>
    )
}
