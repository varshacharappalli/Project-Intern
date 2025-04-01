import axios from "axios";
import { ADD_GSTIN, ADD_GSTIN_ERROR, VIEW_GSTINS, VIEW_GSTINS_ERROR } from "./actionTypes.js";

export const addGSTIN = (gstUsername, gstin) => async (dispatch) => {
    try {
        const response = await axios.post("http://localhost:5001/api/addGSTIN", { gstUsername, gstin });
        dispatch({
            type: ADD_GSTIN,
            payload: response.data.data
        });
    } catch (error) {
        dispatch({
            type: ADD_GSTIN_ERROR,
            payload: error.response.data.message
        });
    }
};
export const viewGSTINs = () => async (dispatch) => {
    try {
        const response = await axios.get("http://localhost:5001/api/viewAll");
        dispatch({
            type: VIEW_GSTINS,
            payload: response.data.data
        });
    } catch (error) {
        dispatch({
            type: VIEW_GSTINS_ERROR,
            payload: error.response.data.message
        });
    }
};
