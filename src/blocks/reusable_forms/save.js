import React from 'react';
import { RawHTML } from '@wordpress/element'
import { isEmpty } from 'lodash'

function save(props) {
    const formId = props.attributes.formId;
    const shortCode = `[gutenberg_form id=${formId}]`
    const shouldRender = !isEmpty(formId);

    return shouldRender ? <RawHTML>{shortCode}</RawHTML> : null;
}

export default save;
