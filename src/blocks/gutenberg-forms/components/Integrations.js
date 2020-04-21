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
                map(integrations, (integration, name) => {

                    const { title, enable, api_fields, fields, query_fields } = integration;

                    if (enable) {
                        return (
                            <PanelBody title={__(title, TEXT_DOMAIN)}>
                                <FieldPlotter
                                    fields={fields}
                                    name={name}
                                    data={props.data}
                                    clientId={props.clientId}
                                    api_fields={api_fields}
                                    query_fields={query_fields}
                                />
                            </PanelBody>
                        )
                    }

                })
            }
        </Fragment>
    )
}

export default Integrations; 