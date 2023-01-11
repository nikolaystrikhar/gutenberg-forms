import React from 'react';
import Logo from '../components/logo';
import Navigation from './Navigation';
import { withRouter } from 'react-router-dom';

const Header = props => (
	<div className="gufo-min-h-full">
		<header className="gufo-bg-gradient-to-r gufo-from-sky-800 gufo-to-cyan-600 gufo-pb-24">
			<div className="gufo-mx-auto gufo-max-w-3xl gufo-px-4 gufo-px-6 gufo-max-w-7xl gufo-px-8">
				<div className="gufo-relative gufo-flex gufo-flex-wrap gufo-items-center gufo-justify-between">
					<div className="gufo-left-0 gufo-flex-shrink-0 gufo-py-5 gufo-static">
						<Logo/>
					</div>

					<div className="gufo-w-full gufo-py-1 gufo-border-t gufo-border-white gufo-border-opacity-20">
						<div className="gufo-mt-4 lg:gufo-grid lg:gufo-grid-cols-3 lg:gufo-items-center lg:gufo-gap-8">
							<div className="gufo-col-span-2 gufo-block">
								<Navigation {...props} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	</div>
);

export default withRouter(Header);
