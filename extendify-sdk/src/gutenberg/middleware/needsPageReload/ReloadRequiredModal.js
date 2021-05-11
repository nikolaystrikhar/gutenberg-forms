import { __ } from '@wordpress/i18n'
import { TEXT_DOMAIN } from '../../global'
import {
    Modal, Button, ButtonGroup, 
} from '@wordpress/components'
import { useState } from '@wordpress/element'
import { dispatch, select } from '@wordpress/data'

export const ReloadRequiredModal = () => {
    const [isSaving, setSaving] = useState(false)
    const { isEditedPostDirty } = select('core/editor')
    const hasUnsavedChanges = isEditedPostDirty()
    const saveChanges = async () => {
        setSaving(true)
        await dispatch('core/editor').savePost()
        setSaving(false)
    }
    const reload = () => {
        location.reload()
    }
    if (!hasUnsavedChanges) {
        reload()
        return null
    }
    return (
        <>
            <Modal title={__('Reload required', TEXT_DOMAIN)} isDismissible={false}>
                <p style={{
                    maxWidth: '400px', 
                }}>
                    {__('Just one more thing! We need to reload the page to continue.', TEXT_DOMAIN)}
                </p>
                <ButtonGroup>
                    <Button isPrimary onClick={reload} disabled={isSaving}>
                        {__('Reload page', TEXT_DOMAIN)}
                    </Button>
                    <Button isSecondary onClick={saveChanges} isBusy={isSaving} style={{
                        margin: '0 4px', 
                    }}>
                        {__('Save changes', TEXT_DOMAIN)}
                    </Button>
                </ButtonGroup>
            </Modal>
        </>
    )
}
