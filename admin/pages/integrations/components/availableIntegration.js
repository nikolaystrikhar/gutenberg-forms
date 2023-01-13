import React, { useEffect, useState } from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Button,
	IconButton,
} from '@wordpress/components';
import { get, attempt, isError, includes, map } from 'lodash';
import { TEXT_DOMAIN } from '../../../contants';

const { __ } = wp.i18n;
const $ = jQuery;

function AvailableIntegration({ integration }) {
	const [installing, setInstalling] = useState(false);
	const [pluginAvailable, setPluginAvailable] = useState(false);

	useEffect(() => {
		const text_domain = get(integration, 'fields.text_domain');
		const installedPluginsTextDomains = map(installedPlugins, 'textdomain');
		const isIntegrationAvailable = includes(
			installedPluginsTextDomains,
			text_domain
		);

		setPluginAvailable(isIntegrationAvailable);
	}, []);

	const title = get(integration, 'fields.title');
	const short_desc = get(integration, 'fields.short_desc');
	const banners = get(integration, 'fields.banners');
	const slug = get(integration, 'fields.slug');
	const pluginPage = `https://wordpress.org/plugins/${slug}`;

	const areBannersValid = !isError(attempt(JSON.parse, banners));
	const screenshot = areBannersValid
		? get(JSON.parse(banners), 'high')
		: null;
	const text_domain = get(integration, 'fields.text_domain');

	const installedPlugins = get(window, 'cwp_global.installed_plugins');

	const installPlugin = () => {
		const data = 'action=cwp_gf_install_plugin&plugin='.concat(slug);
		const url = get(window, 'cwp_global.ajax_url');

		setInstalling(true);

		$.ajax({
			type: 'POST',
			data,
			url,
			success: (response) => {
				setInstalling(false);
				setPluginAvailable(true);
			},
			error: (error) => {
				console.log(error);
				setInstalling(false);
			},
		});
	};

	// if the text domain matches the installed plugins text domain then it is installed and de-activated

	return (
		<Card className="cwp-available_integration">
			<CardHeader className="cwp_integ_header">
				<h3>{title}</h3>
				<IconButton
					label={__('Visit Addon Page', TEXT_DOMAIN)}
					icon="external"
					href={pluginPage}
					target="__blank"
				/>
			</CardHeader>
			<CardMedia>
				<img src={screenshot} />
			</CardMedia>
			<div className="card_data">
				<CardBody>
					<p dangerouslySetInnerHTML={{ __html: short_desc }}></p>
				</CardBody>
				<CardFooter className="foot">
					{pluginAvailable && (
						<form method="POST">
							<input
								type="hidden"
								name="cwp-activate-plugin-script"
								value={text_domain}
							/>
							{!installing && (
								<Button isPrimary type="submit">
									Activate
								</Button>
							)}
						</form>
					)}
					{installing && (
						<Button isPrimary isBusy disabled type="submit">
							Installing
						</Button>
					)}
					{!pluginAvailable && !installing && (
						<Button isPrimary type="submit" onClick={installPlugin}>
							Install Addon
						</Button>
					)}
					<div></div>
				</CardFooter>
			</div>
		</Card>
	);
}

export default AvailableIntegration;
