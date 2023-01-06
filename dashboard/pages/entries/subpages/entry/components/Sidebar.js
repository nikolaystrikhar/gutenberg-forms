import React from 'react';
import { Panel, PanelBody, Card, CardBody } from '@wordpress/components';
import { TEXT_DOMAIN } from '../../../../../contants';
const { __ } = wp.i18n;
const { Button, Icon } = wp.components;

function Sidebar({ data }) {
	return (
		<div className="sidebar">
			<Panel>
				<Card>
					<CardBody>
						<Button className="maxed" isDefault>
							<Icon icon="image-rotate" /> Resend Email
							Notification
						</Button>
					</CardBody>
				</Card>
			</Panel>
		</div>
	);
}

export default Sidebar;
