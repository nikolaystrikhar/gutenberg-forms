/* eslint-disable camelcase */
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
import './extend';
import './extend/renderAddon';

/**
 * Internal dependencies
 */
import { react } from 'react';
import { render } from 'react-dom';
import { get } from 'lodash';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './style.scss';
import Layout from './layout';
import Dashboard from './pages/dashboard/dashboard';
import Integrations from './pages/integrations/integrations';
import Entries from './pages/entries';
import Notices from './components/notices';
import Settings from './pages/settings/settings';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { SlotFillProvider } from '@wordpress/components';
import AddonsProvider from './extend/addonsProvider';

const GlobalComponents = get(window, 'cwp_gf');

class App extends Component {
	render() {
		return (
			<Router>
				<Provider store={store}>
					<Switch>
						<Route
							path="/"
							component={(props) => {
								const { hash } = props.location;

								const CurrentPage = () => {
									if (hash.startsWith('#/dashboard')) {
										return <Dashboard {...props} />;
									} else if (
										hash.startsWith('#/integrations')
									) {
										return <Integrations {...props} />;
									} else if (hash.startsWith('#/settings')) {
										return <Settings {...props} />;
									} else if (hash.startsWith('#/entries')) {
										return <Entries />;
									} else {
										return <Dashboard {...props} />;
									}
								};

								return (
									<SlotFillProvider>
										<Layout {...props}>
											<AddonsProvider />
											<Notices />
											<CurrentPage />
										</Layout>
									</SlotFillProvider>
								);
							}}
						/>
					</Switch>
				</Provider>
			</Router>
		);
	}
}

const root = document.querySelector('#cwp-gutenberg-forms-dashboard-root');

if (root) {
	render(<App />, root);
}
