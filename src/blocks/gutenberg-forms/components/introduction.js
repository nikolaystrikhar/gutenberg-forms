import React from 'react'
import { Button, Card, Placeholder } from "@wordpress/components"


function Introduction(props) {
    const handleType = (type) => {
        props.onSelect(type);
    }

    return (
        <Card>
            <Placeholder icon="feedback" label="Gutenberg Forms" instructions="Select an option below to start.">
                <Button isDefault onClick={() => handleType("standard")}>Standard</Button>
                <Button isDefault onClick={() => handleType("multiStep")}>Multi Step</Button>
            </Placeholder>
        </Card>
    )
}

export default Introduction;