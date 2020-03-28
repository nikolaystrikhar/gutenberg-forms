import React from 'react'
const { Button, Placeholder } = wp.components;


function Introduction(props) {

    const handleType = (type) => {
        props.onSelect(type);
    }

    return (
        <div className="cwp-intro">
            <Placeholder icon="feedback" label="Gutenberg Forms" instructions="Select an option below to start.">
                <div className="types">
                    <Button isDefault onClick={() => handleType("standard")}>Standard</Button>
                    <Button isDefault onClick={() => handleType("multiStep")}>Multi Step</Button>
                </div>
            </Placeholder>
        </div>
    )
}

export default Introduction;