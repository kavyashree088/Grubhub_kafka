import { createStore, applyMiddleware, compose } from "redux";
import allReducers from "../reducers/index.js";
import thunk from "redux-thunk";
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(allReducers, storeEnhancers(applyMiddleware(thunk)));

export default store;
