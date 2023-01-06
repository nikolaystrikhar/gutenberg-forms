import React from 'react';
import { connect } from 'react-redux';
import InformationCard from '../components/information_cards';

function Information(props) {
	const { cards } = props.information;
	return (
		<div className="cwp_info_cards">
			{cards.map((info, key) => {
				return <InformationCard info={info} key={key} />;
			})}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		information: state.information,
	};
};

export default connect(mapStateToProps, null)(Information);
