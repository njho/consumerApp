import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import common from './Reducers/common';
import auth from './Reducers/auth';
import edits from './Reducers/edits';

const reducer = combineReducers({
    common,
    auth,
    edits
});

const middleware = applyMiddleware(thunk);

const store = createStore(reducer, middleware);

export default store;