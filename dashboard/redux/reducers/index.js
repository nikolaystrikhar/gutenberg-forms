import { combineReducers } from 'redux';
import SettingsReducer from './settings';
import InformationReducer from './information';
import GeneralSettingsReducer from './generalSettings';
import NoticeReducer from './notice';
import EntriesReducer from './entries';

export default combineReducers({
	settings: SettingsReducer,
	information: InformationReducer,
	generalSettings: GeneralSettingsReducer,
	notice: NoticeReducer, // for showing / handling notices like integration error and warnings...
	entries: EntriesReducer,
});
