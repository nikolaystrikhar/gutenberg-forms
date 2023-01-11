import React from 'react';
import {connect} from "react-redux";
import Action from "./components/action";

const Dashboard = props => (
	<div className="gufo-bg-gray-200 gufo-divide-y gufo-divide-gray-200 gufo-overflow-hidden gufo-rounded-lg sm:gufo-grid sm:gufo-grid-cols-2 sm:gufo-gap-px sm:gufo-divide-y-0">
		{props.information.cards.map((data, key) => <Action data={data} index={key} key={key}/>)}
	</div>
);

const mapStateToProps = (state) => {
	return {
		information: state.information,
	};
};

export default connect(mapStateToProps, null)(Dashboard);
