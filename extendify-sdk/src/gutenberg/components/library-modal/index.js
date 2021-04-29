/**
 *
 * Wordpress Dependencies
 *
 */

import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { Modal, Icon } from '@wordpress/components'
import { withSelect, withDispatch } from '@wordpress/data'
import { useEffect, useRef } from '@wordpress/element'
import {
    isEmpty, isEqual, get,
} from 'lodash'

/**
 *
 * Custom Imports
 *
 */
import { TEXT_DOMAIN } from '../../global'
import TemplatesLibraryContent from '../library-content/index'
import TemplatesLibrarySidebar from '../library-sidebar/index'
import { Templates } from '../../api'
import classnames from 'classnames'
import CustomIcon from '../../assets/icons'

function TemplatesLibraryModal({
    previewStatus,
    closeLibraryModal,
    appliedFilters,
    setTemplates,
    setLoadingStatus,
    isPreviewingTemplate,
    currentScreen,
    goBack,
}) {
    const didMountRef = useRef(false)
    const isInitialRequest = useRef(true)

    const handleAPICalls = () => {
        setLoadingStatus('templates', true)

        Templates.get(appliedFilters, {
            initial: +isInitialRequest.current,
        })
            .then((data) => {
                const newOffset = get(data, 'offset')
                setTemplates({
                    ...data,
                    offset: isEmpty(newOffset)
                        ? ''
                        : newOffset,
                })
                setLoadingStatus('templates', false)

                if (isInitialRequest.current) {
                    isInitialRequest.current = false
                }
            })
            .catch(() => {
                setTemplates({
                    records: [],
                    offset: '',
                })
                setLoadingStatus('templates', false)
            })
    }

    useEffect(() => {
        // for not firing on initial render

        if (didMountRef.current && previewStatus) {
            handleAPICalls()
        } else {
            didMountRef.current = true
        }
        // TODO: optimize this?
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedFilters, previewStatus])

    return previewStatus
        ? (
            <Modal
                shouldCloseOnClickOutside={false}
                icon={<Icon icon="arrow-left-alt2" onClick={goBack} className="etfy-back-button" />}
                title={__(<CustomIcon icon="library" />)}
                className={`etfy-templates-library-modal-root ${`etfy-screen-${currentScreen}`}`}
                onRequestClose={closeLibraryModal}
                closeLabel={__('close', TEXT_DOMAIN)}
            >
                <div
                    className={classnames({
                        'etfy-templates-library-modal': true,
                        'etfy-previewing-template': isPreviewingTemplate(),
                        [`etfy-screen-${currentScreen}`]: true,
                    })}
                >
                    <TemplatesLibrarySidebar />
                    <TemplatesLibraryContent />
                </div>
            </Modal>
        )
        : null
}

export default compose([
    withSelect((select) => {
        const { getLibraryPreviewStatus, getAppliedFilters, getCurrentPreviewTemplate, getCurrentScreen } = select('extendify-templates/data')

        return {
            previewStatus: getLibraryPreviewStatus(),
            appliedFilters: getAppliedFilters(),
            currentScreen: getCurrentScreen(),

            /**
             * If the user is currently previewing a template
             */
            isPreviewingTemplate() {
                const currentPreviewTemplate = getCurrentPreviewTemplate()
                return !isEmpty(currentPreviewTemplate)
            },
        }
    }),
    withDispatch((dispatch, { currentScreen }) => {
        const {
            setLibraryPreviewStatus,
            setTemplates,
            setLoadingStatus,
            setCurrentPreviewTemplate,
            setCurrentScreen,
        } = dispatch('extendify-templates/data')

        return {

            /**
             * Will go back from the current screen
             */

            goBack() {
                setCurrentPreviewTemplate({})

                if (isEqual(currentScreen, 'single-template')) {
                    setCurrentScreen('templates')
                }

                if (isEqual(currentScreen, 'templates')) {
                    setCurrentScreen('menu')
                }
            },

            /**
             * Will close the templates Library Modal
             */

            closeLibraryModal() {
                setLibraryPreviewStatus(false)
            },
            setTemplates,
            setLoadingStatus,
        }
    }),
])(TemplatesLibraryModal)
