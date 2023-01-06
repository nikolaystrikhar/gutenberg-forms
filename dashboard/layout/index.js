import React from 'react';
import Header from './header';

function Layout(props) {
	return (
		<div>
			<Header {...props} />
			<div style={{ width: '95%', margin: '30px auto' }}>
				{props.children}
			</div>
		</div>
	);
}

export default Layout;
