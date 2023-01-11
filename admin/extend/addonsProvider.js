import React, { useState, useEffect, Fragment } from 'react';
import { isEmpty, get, isFunction } from 'lodash';
import { connect } from 'react-redux';
import { TEXT_DOMAIN } from '../contants';
const { applyFilters, addAction, removeFilter, removeAction } = wp.hooks;
import * as components from '@wordpress/components';
const GlobalComponents = get(window, 'cwp_gf');
const { __ } = wp.i18n;

function AddonsProvider(props) {
	const [addons, setAddons] = useState([]);
	const { integrations } = props.settings;

	const updateAddons = () => {
		const updatedAddonsList = applyFilters('cwp_gf.registerAddon', []);

		setAddons(updatedAddonsList);
	};

	useEffect(() => {
		return () => {
			removeFilter(
				'cwp_gf.registerAddon',
				'cwp/gutenberg-forms/registerAddon'
			);
			removeAction(
				'cwp_gf.registerAddon',
				'cwp/gutenberg-forms/updateAddons'
			);
		};
	});

	useEffect(() => {
		addAction(
			'cwp_gf.update_addons',
			'cwp/gutenberg-forms/updateAddons',
			updateAddons
		);
	}, []);

	const getSlotComponent = (path) => {
		const modifiedPath = isEmpty(path) ? '' : 'extend.' + path + '.Fill';
		const RenderSlotComponent = get(GlobalComponents, modifiedPath);

		return RenderSlotComponent;
	};

	const isParentIntegrationActive = (parent) => {
		const parentIntegration = get(integrations, parent);
		const isEnabled = get(parentIntegration, 'enable');

		if (!isEmpty(parentIntegration) && isEnabled) {
			return true;
		}

		return false;
	};

	return (
		<Fragment>
			{addons.map((data, idx) => {
				const slug = get(data, 'slug');
				const RenderContent = get(data, 'config.render');
				const renderSlot = get(data, 'config.renderSlot');
				const RenderSlotComponent = getSlotComponent(renderSlot);
				const isValidSlot = isFunction(RenderSlotComponent);
				const parent = get(data, 'config.parent');
				const isActive = isParentIntegrationActive(parent);

				if (!isValidSlot) {
					console.error(
						__(
							`Invalid RenderSlot in the addon ${slug}`,
							TEXT_DOMAIN
						)
					);
				}

				return (
					isActive &&
					isValidSlot && (
						<RenderSlotComponent>
							<RenderContent
								element={React}
								components={components}
							/>
						</RenderSlotComponent>
					)
				);
			})}
		</Fragment>
	);
}

const mapStateToProps = (state) => {
	const { settings } = state;

	return {
		settings,
	};
};

export default connect(mapStateToProps, null)(AddonsProvider);
