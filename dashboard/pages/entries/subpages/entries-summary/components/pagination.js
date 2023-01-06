import React from 'react';
import { TEXT_DOMAIN } from '../../../../../contants';
const { __ } = wp.i18n;
const { IconButton } = wp.components;

function SummaryPagination(props) {
	const { currentPage, totalPages, onNext, onPrev } = props;

	const nextIndex = currentPage + 1,
		prevIndex = currentPage - 1,
		hasNextPage = nextIndex <= totalPages,
		hasPrevPage = prevIndex > 0;

	const disableProps = { disabled: true };
	const nextDisable = hasNextPage ? {} : disableProps;
	const prevDisable = hasPrevPage ? {} : disableProps;

	return (
		<div className="cwp-summary-pagin">
			<span>
				{__(
					`${currentPage} - ${totalPages} of ${totalPages}`,
					TEXT_DOMAIN
				)}
			</span>
			<div className="pagin-icons">
				<IconButton
					{...prevDisable}
					icon="arrow-left-alt2"
					onClick={onPrev}
				/>
				<IconButton
					{...nextDisable}
					icon="arrow-right-alt2"
					onClick={onNext}
				/>
			</div>
		</div>
	);
}

export default SummaryPagination;
