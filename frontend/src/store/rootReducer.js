import { combineReducers } from "redux";
import { gstinReducer } from "./reducers.js";

const rootReducer = combineReducers({
    gstinState: gstinReducer
});

export default rootReducer;
