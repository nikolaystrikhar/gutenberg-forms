import React, { useEffect, useState } from 'react';
import { TEXT_DOMAIN } from '../../../contants';
import { Modal } from '@wordpress/components';
import { connect } from 'react-redux';
import Icons from '../../../components/Icons';
import { extractFormId } from '../utils';
import { withRouter } from 'react-router-dom';

const { __ } = wp.i18n;
const { Button } = wp.components;

function Export(props) {
	const { hash, pathname, search } = props.location;

	const [exportModal, setExportModal] = useState(false);
	const openExportModal = () => setExportModal(true);
	const closeExportModal = () => setExportModal(false);
	const formId = extractFormId(hash);

	const exportOptions = [
		{
			title: __('CSV Format', TEXT_DOMAIN),
			icon: 'csv',
			extension: 'csv',
		},
		{
			title: __('JSON Format', TEXT_DOMAIN),
			icon: 'json',
			extension: 'json',
		},
		{
			title: __('Excel Format', TEXT_DOMAIN),
			icon: 'xls',
			extension: 'xls',
		},
	];

	return (
		<div className="cwp-export">
			{exportModal && (
				<Modal
					className="cwp-export-modal"
					title={__('Export Options', TEXT_DOMAIN)}
					onRequestClose={closeExportModal}
				>
					<div className="cwp-export-opts">
						{exportOptions.map((option, idx) => {
							return (
								<div key={idx} className="cwp-export-opt">
									<div className="head">
										<span className="cwp-badge free">
											FREE
										</span>
									</div>
									<Icons
										icon={option.icon}
										width={50}
										height={50}
									/>
									<h3> {option.title} </h3>
									<form method="POST">
										<input
											type="hidden"
											name="cwp-gutenberg_forms_entries-export-form-id"
											value={formId}
										/>
										<input
											type="hidden"
											name="cwp-gutenberg_forms_entries-export-format"
											value={option.extension}
										/>
										<Button
											isPrimary
											type="submit"
											name="submit"
											className="cwp-exp-btn"
										>
											{__('Export', TEXT_DOMAIN)}
										</Button>
									</form>
								</div>
							);
						})}
					</div>
				</Modal>
			)}
			<Button isDefault onClick={openExportModal}>
				{__('Export Entries', TEXT_DOMAIN)}
			</Button>
		</div>
	);
}

const mapStateToProps = (state) => {
	const { entries } = state;
	return entries;
};

export default connect(mapStateToProps, null)(withRouter(Export));
