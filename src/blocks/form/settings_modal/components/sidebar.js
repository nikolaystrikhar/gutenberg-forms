import React, { useEffect, useState } from "react";
import {
    PanelBody,
    Panel,
    PanelRow,
    MenuGroup,
    MenuItem,
    ButtonGroup,
    Button
} from "@wordpress/components";
import { getCatagories } from '../../../../block/api'
import { isEqual } from "lodash"
const { __ } = wp.i18n;

function Sidebar(props) {

    const { data } = props;

    const [catagories, setCatagories] = useState([]);

    useEffect(() => {

        getCatagories()
            .then((catags) => {
                setCatagories(catags);

                if (catags[0]) {

                    const first_catagory = catags[0];
                    props.applyCatagory(first_catagory);
                }

            })
            .catch(err => console.error(err));

    }, []);


    // Disabling the insertion of saved form when the user is in cpt
    const { isCpt } = props;

    return (
        <div className="cwp__sidebar">
            <div className="cwp__panel_main">
                <MenuGroup>
                    <MenuItem
                        icon="admin-post"
                        disabled={isCpt}
                        onClick={() => props.applyCatagory('Saved Forms')}
                        isSelected={false}
                        isDefault={props.currentCatagory === 'Saved Forms'}
                        initialOpen={false}
                    >
                        Saved Forms
                    </MenuItem>
                </MenuGroup>

                <PanelBody title={__("Categories", "forms-gutenberg")}>
                    <MenuGroup>
                        {catagories.map(c => {

                            const catagory_data = data.filter(v => {
                                return isEqual(v.fields.Category, c);
                            });

                            return catagory_data.length !== 0 && <MenuItem
                                onClick={() => props.applyCatagory(c)}
                                isSelected={true}
                                isDefault={props.currentCatagory === c}
                                initialOpen={false}
                            >
                                {c}
                            </MenuItem>
                        })}
                    </MenuGroup>
                </PanelBody>
            </div>
        </div >
    );
}

export default Sidebar;
