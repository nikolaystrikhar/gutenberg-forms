import React from 'react'
import { Button } from "@wordpress/components"

function PreviewBlock(props) {

    const { data } = props;

    return (
        <div className="cwp_temp">
            <div className="cwp_temp_select">
                <h3>{data.link}</h3>
                <iframe src={data.link} />
            </div>
        </div>
    )
}

export default PreviewBlock;