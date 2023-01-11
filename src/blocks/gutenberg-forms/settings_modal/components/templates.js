import React from 'react'
import {

    Panel,
    MenuGroup,
    MenuItem

} from "@wordpress/components"
import { get, isEqual } from "lodash"

const { __ } = wp.i18n;

function Templates(props) {


    const { templates, currentTemplate } = props;

    const currentTemplateName = get(currentTemplate, 'fields.Name');

    return (
        <div className="cwp-templates">
            <Panel header={__(<strong>Available Templates</strong>, "forms-gutenberg")}>
                <MenuGroup>
                    {
                        templates.map((template, index) => {

                            const name = get(template, 'fields.Name');

                            return <MenuItem onClick={() => props.onSelect(template)} isDefault={isEqual(currentTemplateName, name)} key={index}>{name}</MenuItem>

                        })
                    }
                </MenuGroup>
            </Panel>
        </div>
    )
}

export default Templates;
