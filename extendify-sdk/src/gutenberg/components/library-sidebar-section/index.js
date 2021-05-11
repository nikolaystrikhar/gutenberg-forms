/**
 *
 * Wordpress Dependencies
 *
 */

import { has, isEmpty } from 'lodash';

function TemplatesLibrarySidebarMenu(props) {
    return (
        <div className="etfy-templates-library-sidebar-menu">
            {has(props, 'title') && !isEmpty(props.title) && <h2>{props.title}</h2>}
            {props.children}
        </div>
    );
}

export default TemplatesLibrarySidebarMenu;
