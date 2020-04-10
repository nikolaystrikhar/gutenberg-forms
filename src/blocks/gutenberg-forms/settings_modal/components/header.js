import React from "react";
import { TextControl, Icon } from "@wordpress/components";

function Header(props) {
    return (
        <div className="cwp__header">
            <div className="cwp_selected__catagory">
                <h2><strong>{props.currentCatagory}</strong></h2>
            </div>
            <div className="cwp__search">
                <TextControl placeholder="Search..." />
            </div>
        </div>
    );
}

export default Header;
