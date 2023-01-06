import React, { Fragment, useState, useEffect } from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	CardMedia,
	CardFooter,
	Button,
	Tooltip,
	Guide,
	GuidePage,
	IconButton,
} from '@wordpress/components';
import { map, isEmpty } from 'lodash';
import { TEXT_DOMAIN } from '../contants';
import { connect } from 'react-redux';
import { setIntegration } from '../redux/actions/settings/setIntegration';
import { setIntegrationDetails } from '../redux/actions/settings/setIntegrationDetails';
import { parse_guide } from '../functions';
import { NavLink } from 'react-router-dom';
import { addNotice } from '../redux/actions/notice/addNotice';

const { FormToggle } = wp.components;
const { __ } = wp.i18n;

function IntegrationBlock(props) {
	const {
		title,
		description,
		image,
		enabled,
		fields,
		integration,
		guide,
		is_pro,
		error,
		is_disabled,
		guide_url,
	} = props;

	const throwError = () => {
		if (true === is_disabled) {
			props.addNotice({
				...error,
				uniqueKey: integration,
			});
		}
	};

	useEffect(throwError, []);

	const [state, setState] = useState({
		enabled,
	});

	const [show_info, set_info] = useState(false);

	const handleEnable = () => {
		props.setIntegration(integration, !enabled);

		setState({ enabled: !enabled });
	};

	const handleGuide = () => {
		set_info(true);
	};

	const disabledClass = true === is_disabled ? 'is-disabled' : '';
	const rootClass = `cwp_integration_block ${disabledClass}`;
	const guideHash = isEmpty(guide_url)
		? {}
		: {
				href: guide_url,
				target: '__blank',
		  };

	return (
		<Fragment>
			<Card className={rootClass}>
				<CardHeader
					style={{ backgroundColor: is_pro ? '#000' : '#fff' }}
					className="cwp_integ_header"
				>
					<h3 style={{ color: !is_pro ? '#000' : '#fff' }}>
						{title}
					</h3>
					{true !== is_disabled ? (
						<span
							className={`cwp_integ_status ${
								is_pro ? 'pro_status' : 'free_status'
							}`}
						>
							{is_pro ? 'Pro' : 'Free'}
						</span>
					) : (
						<span
							className="cwp_disabled_info_badge"
							onClick={throwError}
						>
							<span className="dashicons dashicons-info"></span>
						</span>
					)}
				</CardHeader>
				<CardMedia>
					<img src={image} />
				</CardMedia>
				<div className="card_data">
					<CardBody>
						<p
							dangerouslySetInnerHTML={{ __html: description }}
						></p>
					</CardBody>
					<CardFooter className="foot">
						<Button {...guideHash} onClick={handleGuide} isDefault>
							{__('View Guide', TEXT_DOMAIN)}
						</Button>

						<div>
							<h4>Enable</h4>
							<FormToggle
								onChange={handleEnable}
								checked={state.enabled}
								className="middle"
							/>
							{enabled && !isEmpty(fields) && (
								<Tooltip
									text={__('Configure Settings', TEXT_DOMAIN)}
								>
									<NavLink
										to={{
											pathname: props.location.pathname,
											search: props.location.search,
											hash: '#/settings/' + integration,
										}}
									>
										<IconButton icon="admin-generic" />
									</NavLink>
								</Tooltip>
							)}
						</div>
					</CardFooter>
				</div>
			</Card>
			{show_info && !isEmpty(guide) && (
				<Guide onFinish={() => set_info(false)}>
					{map(parse_guide(guide), (markup, index) => {
						return (
							<GuidePage>
								<div
									dangerouslySetInnerHTML={{ __html: markup }}
								></div>
							</GuidePage>
						);
					})}
				</Guide>
			)}
		</Fragment>
	);
}

const mapStateToProps = (state) => ({
	settings: state.settings,
});

const mapDispatchToProps = {
	setIntegration,
	setIntegrationDetails,
	addNotice,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationBlock);
