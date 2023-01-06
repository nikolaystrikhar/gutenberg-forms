import React from 'react';
import { Card, CardBody, CheckboxControl } from '@wordpress/components';
import { connect } from 'react-redux';
import { clone, get } from 'lodash';
import { extract_fields } from '../utils';
import { TEXT_DOMAIN } from '../../../contants';

const { __ } = wp.i18n;

function AdvancedFilters(props) {
	const {
		entries,
		entries: { data },
		setScreenOptions,
		screenOptions,
	} = props;

	return (
		<div className="cwp-advanced-filter">
			<Card>
				<CardBody>
					<span>
						<strong>{__('Columns', TEXT_DOMAIN)}:</strong>{' '}
					</span>
					<div
						style={{ marginTop: 10 }}
						className="cwp-columns-filter"
					>
						{extract_fields(data).map((column) => {
							const checked = get(screenOptions.columns, column);

							return (
								<CheckboxControl
									className="col-chk"
									label={column}
									onChange={() => {
										const newColumns = clone(
											screenOptions.columns
										);

										newColumns[column] = !checked;

										setScreenOptions({
											...screenOptions,
											columns: newColumns,
										});
									}}
									checked={checked}
								/>
							);
						})}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { entries } = state;

	return {
		entries,
	};
};

export default connect(mapStateToProps, null)(AdvancedFilters);
