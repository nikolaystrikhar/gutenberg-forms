import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function edit(props) {
    return (
        <div className="cwp-form-step">
            <h3>Step Start</h3>
            <InnerBlocks
                templateLock={false}
                renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            />
            <h3>Step End</h3>
        </div>
    );
}

export default edit;
