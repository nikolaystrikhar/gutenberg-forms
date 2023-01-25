import React from 'react'
import { Button } from "@wordpress/components"

const new_form_url = cwpGlobal.new_form_url;

function Empty({ message }) {


    return (
        <div className="cwp-empty">
            <div className="placeholder">
                <h1>{message}</h1>
                <img src="https://dl.airtable.com/.attachmentThumbnails/bdc2fb6125e03d2979babf9ec54b10d3/27d0500c" />
                <Button href={new_form_url} isPrimary={true}>
                    Create Form
                </Button>
            </div>
        </div>
    )
}

export default Empty;