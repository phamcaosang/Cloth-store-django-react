import axios from 'axios';
import {
    GET_SHIPPING_OPTIONS_SUCCESS,
    GET_SHIPPING_OPTIONS_FAIL
} from './types';
import { apiURI } from '../../helpers/requestServer';

export const get_shipping_options = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
        }
    };

    try {
        const res = await axios.get(`${apiURI}/api/shipping/get-shipping-options`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_SHIPPING_OPTIONS_SUCCESS,
                payload: res.data
            });
            console.log("Shipping success")
        } else {
            dispatch({
                type: GET_SHIPPING_OPTIONS_FAIL
            });
            console.log("Shipping failed")

        }
    } catch(err) {
        dispatch({
            type: GET_SHIPPING_OPTIONS_FAIL
        });
        console.log("Shipping failed")
    }
};