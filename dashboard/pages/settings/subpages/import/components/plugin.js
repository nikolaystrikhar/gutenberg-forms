import React from 'react';
import { get, isEmpty } from 'lodash';

import {
	Card,
	CardBody,
	CardDivider,
	CardFooter,
	CardHeader,
	CardMedia,
} from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../../contants';

const { Icon, Button } = wp.components;
const { __ } = wp.i18n;

function Plugin(props) {
	const data = props.plugin;
	const name = get(data, 'Name');
	const description = get(data, 'description');
	const icon = get(data, 'icon');

	return (
		<Card isSmall className="cwp-plugin-import">
			<CardBody>
				<h3>
					<span>
						{!isEmpty(icon) && <Icon icon={icon} />}
						{name}
					</span>
					<Button isPrimary onClick={() => props.onSelect(data)}>
						{__('Import', TEXT_DOMAIN)}
					</Button>
				</h3>
				<p>{description}</p>
			</CardBody>
		</Card>
	);
}

export default Plugin;
