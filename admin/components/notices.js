import React from 'react';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { Notice } from '@wordpress/components';
import { removeNotice } from '../redux/actions/notice/removeNotice';

function Notices(props) {
	return (
		<div className="cwp-notices-root">
			{props.notice.data.map((notice, index) => {
				const noticeStatus = get(notice, 'status');
				const status = isEmpty(noticeStatus) ? 'warning' : noticeStatus;
				const message = get(notice, 'message');
				const id = get(notice, 'id');

				return (
					<Notice
						className="cwp-notice"
						key={index}
						status={status}
						isDismissible={true}
						onRemove={() => props.removeNotice(id)}
					>
						<p dangerouslySetInnerHTML={{ __html: message }}></p>
					</Notice>
				);
			})}
		</div>
	);
}

const mapStateToProps = (state) => {
	const { notice } = state;

	return {
		notice,
	};
};

const mapDispatchToProps = {
	removeNotice,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notices);
