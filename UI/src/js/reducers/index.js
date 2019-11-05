import { combineReducers } from "redux";
import userReducer from "./createUserReducer";
import ownerReducer from "./ownerReducer";
import orderReducer from "./orderReducer";

const allReducers = combineReducers({
  userDetails: userReducer,
  ownerDetails: ownerReducer,
  orderDetails: orderReducer
});

export default allReducers;
