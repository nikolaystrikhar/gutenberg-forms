import React from 'react'
import { SelectControl } from '@wordpress/components'
import { map } from 'lodash'
import { TEXT_DOMAIN } from '../../../block/constants';
import { serializeFields } from '../../../block/misc/helper'

const { __ } = wp.i18n;

function FieldPlotter({ fields, clientId }) {

    return (
        <div className="cwp-fields-plotter">

            {
                map(fields, (field, key) => {

                    const { label } = field;

                    return (
                        <h1>FIELD</h1>
                    )

                })
            }

        </div>
    )
}

export default FieldPlotter; 