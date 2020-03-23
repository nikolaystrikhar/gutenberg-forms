import React from 'react'
import { Button } from "@wordpress/components"


function Introduction(props) {


    const handleType = (type) => {
        props.onSelect(type);
    }

    return (
        <div className="cwp-forms-introduction">
            <h3>Form Type</h3>
            <div className="cwp-form-types">
                <Button isPrimary onClick={() => handleType("standard")}>Standard</Button>
                <Button isPrimary onClick={() => handleType("multiStep")}>Multi Step</Button>
            </div>
        </div>
    )
}

export default Introduction;