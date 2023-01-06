import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import combineReducers from '../reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension';
const initialState = {};

const middlewares = [thunk];

const store = createStore(
	combineReducers,
	initialState,
	composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
