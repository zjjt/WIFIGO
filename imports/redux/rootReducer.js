import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import processReducer from './reducers/processReducer'



const reducers={
	form:formReducer,
	flowProcess:processReducer
};
const rootReducer=combineReducers(reducers);
export {rootReducer};