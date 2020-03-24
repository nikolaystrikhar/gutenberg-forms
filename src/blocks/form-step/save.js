import React from "react";
import { InnerBlocks } from "@wordpress/block-editor";

function save(props) {
    return (
        <fieldset className="cwp-form-step">
            <InnerBlocks.Content />
        </fieldset>
    );
}

export default save;
