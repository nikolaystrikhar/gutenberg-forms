import React from 'react';
import Header from './header';

function Layout(props) {
	return (
		<div>
			<Header {...props} />
			<div className="gufo--mt-20 gufo-mx-10">
				{props.children}
			</div>
		</div>
	);
}

export default Layout;
