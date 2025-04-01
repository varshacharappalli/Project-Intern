import { combineReducers } from "redux";
import { gstinReducer } from "./reducers";

const rootReducer = combineReducers({
    gstinState: gstinReducer
});

export default rootReducer;
