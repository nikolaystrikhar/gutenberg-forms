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
import { TEXT_DOMAIN } from "../../../../block/constants";
const { __ } = wp.i18n;

function Sidebar(props) {

    const [catagories, setCatagories] = useState([]);

    const getActiveCol = c => {
        if (props.columns === c) {
            return {
                isPrimary: true
            };
        }

        return {
            isDefault: true
        };
    };

    useEffect(() => {

        getCatagories()
            .then((catags) => setCatagories(catags))
            .catch(err => console.error(err));

    }, []);

    const { isCpt } = props;

    return (
        <div className="cwp__sidebar">
            <div className="cwp__panel_main">
                <Panel>
                    <div className="cwp__view">
                        <PanelRow>
                            <span>View</span>
                            <ButtonGroup>
                                <Button
                                    {...getActiveCol(2)}
                                    onClick={() => props.setColumns(2)}
                                >
                                    2
								</Button>
                                <Button
                                    {...getActiveCol(3)}
                                    onClick={() => props.setColumns(3)}
                                >
                                    3
								</Button>
                                <Button
                                    {...getActiveCol(4)}
                                    onClick={() => props.setColumns(4)}
                                >
                                    4
								</Button>
                            </ButtonGroup>
                        </PanelRow>
                    </div>
                </Panel>
                <MenuGroup>
                    <MenuItem
                        disabled={isCpt}
                        onClick={() => props.applyCatagory('Saved Forms')}
                        isSelected={false}
                        isPrimary={props.currentCatagory === 'Saved Forms'}
                        initialOpen={false}
                    >
                        My Forms
                    </MenuItem>
                </MenuGroup>

                <PanelBody title={__("Catagories", TEXT_DOMAIN)}>
                    <MenuGroup>
                        {catagories.map(c => (
                            <MenuItem

                                onClick={() => props.applyCatagory(c)}
                                isSelected={true}
                                isPrimary={props.currentCatagory === c}
                                initialOpen={false}
                            >
                                {c}
                            </MenuItem>
                        ))}
                    </MenuGroup>
                </PanelBody>
            </div>
        </div>
    );
}

export default Sidebar;
