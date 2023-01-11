/* eslint-disable camelcase */
/**
 * WordPress dependencies
 */
const { Component } = wp.element;
import './extend';
import './extend/renderAddon';

/**
 * Internal dependencies
 */
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './layout';
import Dashboard from './pages/dashboard/dashboard';
import Integrations from './pages/integrations/integrations';
import Notices from './components/notices';
import Settings from './pages/settings/settings';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { SlotFillProvider } from '@wordpress/components';
import AddonsProvider from './extend/addonsProvider';
import './style.scss';

class App extends Component {
	render() {
		return (
			<Router>
				<Provider store={store}>
					<Switch>
						<Route
							path="/"
							component={props => {
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
