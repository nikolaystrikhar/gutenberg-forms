import React from 'react';
import { map, get, isEqual } from 'lodash';
import { NavLink, withRouter } from 'react-router-dom';
import { Icon } from '@wordpress/components';

function Breadcrumbs(props) {
	const { data, align } = props;
	const { hash, search, pathname } = props.location;

	const defaultLocation = {
		search,
		pathname,
	};

	return (
		<div className={`cwp-breadcrumbs ${align}`}>
			{map(data, (crumb, idx) => {
				const label = get(crumb, 'label');
				const route = get(crumb, 'link');

				return (
					<div key={idx} className="breadcrumb">
						<NavLink
							to={{
								...defaultLocation,
								hash: route,
							}}
						>
							{label}
						</NavLink>
						{!isEqual(idx, data.length - 1) && (
							<Icon
								icon="arrow-right-alt2"
								className="cwp-separator"
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default withRouter(Breadcrumbs);
