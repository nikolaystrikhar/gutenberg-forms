import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function edit(props) {
    return (
        <div className="cwp-form-step">
            <span className="step-divider start"><div class="divider"><span></span><span>Step Start</span><span></span></div></span>
            <InnerBlocks
                templateLock={false}
                renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            />
            <span className="step-divider end"><div class="divider"><span></span><span>Step End</span><span></span></div></span>
        </div>
    );
}

export default edit;
