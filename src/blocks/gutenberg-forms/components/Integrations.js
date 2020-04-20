import React, { Fragment } from 'react'
import { PanelBody } from "@wordpress/components"
import { map } from 'lodash'
import { TEXT_DOMAIN } from '../../../block/constants';
import FieldPlotter from './fieldPlotter'

const { __ } = wp.i18n;

function Integrations(props) {

    const { integrations } = cwpGlobal.settings;

    return (
        <Fragment>
            {
                map(integrations, (integration, index) => {

                    const { title, enable, required_fields } = integration;

                    if (enable) {
                        return (
                            <PanelBody title={__(title, TEXT_DOMAIN)}>
                                <FieldPlotter clientId={props.clientId} fields={required_fields} />
                            </PanelBody>
                        )
                    }

                })
            }
        </Fragment>
    )
}

export default Integrations; 