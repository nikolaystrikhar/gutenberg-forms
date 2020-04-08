import React, { useState, Fragment } from 'react'
import { Button, Placeholder } from "@wordpress/components"
import SettingsModal from '../settings_modal/modal'
const { __ } = wp.i18n;


function Introduction(props) {


    const [modal, setModal] = useState(false);

    const handleType = (type) => {
        props.onSelect(type);
    }

    const { cpt } = props.data.attributes; // weather it is a cpt or not

    return (
        <div className="cwp-intro">
            <SettingsModal cpt={cpt} clientId={props.data.clientId} status={modal} onClose={() => setModal(false)} />
            <Placeholder icon="feedback" label="Gutenberg Forms" instructions="Select an option to create a new form.">
                <div className="types">
                    <Button isDefault onClick={() => handleType("standard")}>Standard</Button>
                    <Button isDefault onClick={() => handleType("multiStep")}>Multi Step</Button>
                    <span> OR </span>
                    <Button isPrimary onClick={() => setModal(true)}>Insert Form</Button>
                </div>
            </Placeholder>
        </div>
    )
}

export default Introduction;