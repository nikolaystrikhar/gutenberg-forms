import { __, sprintf } from '@wordpress/i18n'
import { TEXT_DOMAIN } from '../../global'
import TemplatesLibraryModal from '../../components/library-modal/index'
import { dispatch, select } from '@wordpress/data'
import {
    Modal, Button, ButtonGroup,
} from '@wordpress/components'
import { useState } from '@wordpress/element'
import { render } from '@wordpress/element'
import { ActivatingModal } from './ActivatingModal'

export const ActivatePluginsModal = (props) => {
    const { setSpecificState, setCurrentPreviewTemplate } = dispatch('extendify-templates/data')
    const { getCurrentPreviewTemplate } = select('extendify-templates/data')
    const [isOpen, setOpen] = useState(true)
    const previouslyViewedTemplate = getCurrentPreviewTemplate()

    // Closing the modal will reset the library state
    const closeModal = () => {
        setOpen(false)
        setSpecificState(props.previousState)
        setCurrentPreviewTemplate(previouslyViewedTemplate)
        render(<TemplatesLibraryModal />, document.querySelector('#extendify-root'))
    }

    const installPlugins = async () => {
        setOpen(false)
        render(<ActivatingModal />, document.querySelector('#extendify-root'))
    }
    const type = props.previousState?.currentPreviewTemplate?.fields?.type ?? 'template'
    return (
        <>
            {isOpen && (
                <Modal
                    title={__('Activate required plugins', TEXT_DOMAIN)}
                    closeButtonLabel={__('No thanks, return to library', TEXT_DOMAIN)}
                    onRequestClose={closeModal}
                >
                    <p style={{
                        maxWidth: '400px',
                    }}>
                        {props.message ?? __(sprintf('There is just one more step. This %s requires the following plugins to be activated:',
                            type),
                        TEXT_DOMAIN)}
                    </p>
                    {/* TODO: leaving this hard coded until we can update the airtable data structure */}
                    <ul>
                        <li>Editor Plus</li>
                    </ul>
                    <ButtonGroup>
                        <Button isPrimary onClick={installPlugins}>
                            {__('Activate Plugins', TEXT_DOMAIN)}
                        </Button>
                        {props.showClose && <Button isTertiary onClick={closeModal} style={{
                            boxShadow: 'none', margin: '0 4px',
                        }}>
                            {__('No thanks, return to library', TEXT_DOMAIN)}
                        </Button>}
                    </ButtonGroup>
                </Modal>
            )}
        </>
    )
}
