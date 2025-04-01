import { ADD_GSTIN, ADD_GSTIN_ERROR, VIEW_GSTINS, VIEW_GSTINS_ERROR } from "./actionTypes.js";

const initialState = {
    gstins: [],
    error: null
};

export const gstinReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_GSTIN:
            return {
                ...state,
                gstins: [...state.gstins, action.payload],
                error: null
            };
        case ADD_GSTIN_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case VIEW_GSTINS:
            return {
                ...state,
                gstins: action.payload,
                error: null
            };
        case VIEW_GSTINS_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};
