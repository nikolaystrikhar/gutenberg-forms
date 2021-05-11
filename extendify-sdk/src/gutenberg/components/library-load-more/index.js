/**
 *
 * Wordpress Dependencies
 *
 */
import { Button } from '@wordpress/components'
import { compose, withState } from '@wordpress/compose'
import { withSelect, withDispatch } from '@wordpress/data'
import { get, isEmpty } from 'lodash'
import { useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 *
 * Custom Imports
 *
 */

import { Templates as TemplatesApi } from '../../api'
import { TEXT_DOMAIN } from '../../global/index'

function LoadMoreFilter({ getTemplates, filters, loading, setTemplates, setState }) {
    const loadMore = () => {
        const templates = getTemplates()
        let offset = get(templates, 'offset')

        if (isEmpty(offset) || loading) return

        setState({
            loading: true, error: false,
        })
        TemplatesApi.get(filters, {
            offset,
        })
            .then((data) => {
                const newOffset = get(data, 'offset')
                const newTemplates = get(data, 'records')

                setTemplates({
                    offset: newOffset,
                    records: [...get(templates, 'records'), ...newTemplates],
                })

                setState({
                    loading: false, error: false,
                })
            })
            .catch(() => {
                setState({
                    loading: false, error: true,
                })
            })
    }

    const handleScroll = (event) => {
        const { target } = event

        const reachedEnd = target.scrollHeight - target.scrollTop === target.clientHeight

        if (reachedEnd) {
            loadMore()
        }
    }

    useEffect(() => {
        let container = document.querySelector('.etfy-templates-library-modal-root')

        if (!container) return

        container.addEventListener('scroll', handleScroll)

        return () => container.removeEventListener(
            'scroll', handleScroll, {
                passive: true,
            },
        )
        // TODO: optimize this?
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return getTemplates()?.offset
        ? (
            <div className="etfy-load-more">
                <Button isBusy={loading} disabled={loading} onClick={loadMore} isDefault>
                    {loading
                        ? __('Loading', TEXT_DOMAIN)
                        : __('Load More', TEXT_DOMAIN)}
                </Button>
            </div>
        )
        : null
}

export default compose([
    withState({
        loading: false,
        error: false,
    }),
    withSelect((select) => {
        const { getTemplates, getAppliedFilters } = select('extendify-templates/data')

        return {
            getTemplates: getTemplates,
            filters: getAppliedFilters(),
        }
    }),
    withDispatch((dispatch) => {
        const { setTemplates } = dispatch('extendify-templates/data')
        return {
            setTemplates,
        }
    }),
])(LoadMoreFilter)
