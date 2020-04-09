import React, { useEffect, useState, Fragment } from "react";
import { InnerBlocks } from "@wordpress/block-editor";
import { getRootFormBlock } from "../../../src/block/functions/index";
import { isEmpty, get } from "lodash";
import { Notice } from "@wordpress/components";


function edit(props) {

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const root = getRootFormBlock(props.clientId);

        if (!isEmpty(root)) {

            let root_type = get(root, 'attributes.formType');

            root_type === 'standard' ? setDisabled(true) : null; // checking if the root form is a multistep

        }

    }, [])


    return (
        <div className="cwp-form-step">
            {
                disabled ? <Notice status="warning" isDismissible={false}>This is to be used only within the Multi-Step Form.</Notice> : <Fragment>
                    <span className="step-divider start"><div class="divider"><span></span><span>Step Start</span><span></span></div></span>
                    <InnerBlocks
                        templateLock={false}
                        renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                    />
                </Fragment>
            }
        </div>
    );
}

export default edit;
