import React, { useState, useEffect } from 'react'
import { TextareaControl, Button } from "@wordpress/components";

function bulk_add(prop) {

    const props = prop.data;
    const { options } = props.attributes;

    const [bulkText, setBulkText] = useState("");

    const getValue = () => {

        const labels = options.map(v => v.label),
            value = labels.join("\n");

        return value;
    }

    const handleSave = () => {

        let values = bulkText.split("\n");
        let newOption = values.map(o => {
            return {
                label: o,
                checked: false
            }
        });

        props.setAttributes({ options: newOption, bulkAdd: false });
        prop.onChange(newOption);
    }


    const handleCancel = () => {
        props.setAttributes({ bulkAdd: false });
    }

    useEffect(() => {

        setBulkText(getValue());

    }, [])

    return (
        <div className="cwp-bulk-add">
            <TextareaControl
                style={{ height: 600 }}
                value={bulkText}
                onChange={setBulkText}
            />
            <div className="cwp-save">
                <Button isPrimary onClick={handleSave}>Save</Button>
                <Button isDefault onClick={() => props.setAttributes({ bulkAdd: false })}>Cancel</Button>
            </div>
        </div>
    )
}


export default bulk_add;