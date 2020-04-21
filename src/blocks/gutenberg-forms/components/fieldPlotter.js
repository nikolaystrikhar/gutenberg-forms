import React, { useEffect } from 'react'
import { SelectControl } from '@wordpress/components'
import { map, isEmpty, has, clone, set, get } from 'lodash'
import { TEXT_DOMAIN } from '../../../block/constants';
import { serializeFields } from '../../../block/misc/helper'

const { __ } = wp.i18n;

const { getBlock } = wp.data.select('core/block-editor');

function FieldPlotter({ api_fields, clientId, data, name, fields, query_fields }) {
    const { integrations } = data.attributes;


    useEffect(() => {

        if (!has(integrations, name)) {
            integrations[name] = {}
            data.setAttributes({ integrations });
        }

    }, [])

    const getOptions = () => {
        const root = getBlock(clientId);
        const child_fields = root.innerBlocks;
        const available_fields = serializeFields(child_fields);

        let options = available_fields.map((f, i) => {

            const { fieldName, blockName, adminId } = f;
            const field_label = isEmpty(fieldName) ? adminId : fieldName;


            return {
                label: field_label,
                value: get(adminId, 'value')
            }

        });

        return options;

    }

    const handleFieldsChange = (key, val) => {

        // not mutating the original attribute
        const newIntegrations = clone(integrations);

        set(newIntegrations, name, {
            ...get(integrations, name),
            [key]: val
        });


        data.setAttributes({ integrations: newIntegrations });

    }

    return (
        <div className="cwp-fields-plotter">
            {
                map((query_fields), (field, key) => {

                    const { label, value } = field;
                    const selected = has(integrations[name], key) ? integrations[name][key] : null;


                    let mappedValues = value.map((v) => {
                        return {
                            value: v.value,
                            label: v.name
                        }
                    });


                    let values = [
                        {
                            label,
                            value: null
                        },
                        ...mappedValues
                    ]

                    return <SelectControl

                        label={label}
                        value={selected}
                        options={values}
                        onChange={(v) => handleFieldsChange(key, v)}
                    />


                })
            }
            {
                map(api_fields, (field, key) => {

                    const { label } = field;
                    const value = has(integrations[name], key) ? integrations[name][key] : null;

                    return (
                        <div className="cwp_field_plot">
                            <SelectControl
                                onChange={(val) => handleFieldsChange(key, val)}
                                label={label}
                                value={value}
                                options={[
                                    {
                                        label: 'Select Field',
                                        value: null,
                                    },
                                    ...getOptions()
                                ]}
                            />
                        </div>
                    )

                })
            }

        </div>
    )
}

export default FieldPlotter; 