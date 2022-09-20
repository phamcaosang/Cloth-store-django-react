import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_WISHLIST_ITEMS_SUCCESS,
    GET_WISHLIST_ITEMS_FAIL,
    ADD_WISHLIST_ITEM_SUCCESS,
    ADD_WISHLIST_ITEM_FAIL,
    GET_WISHLIST_ITEM_TOTAL_SUCCESS,
    GET_WISHLIST_ITEM_TOTAL_FAIL,
    REMOVE_WISHLIST_ITEM_SUCCESS,
    REMOVE_WISHLIST_ITEM_FAIL,
    CLEAR_WISHLIST,
} from './types';
import { apiURI } from '../../helpers/requestServer';

export const get_wishlist_items = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`${apiURI}/api/wishlist/wishlist-items`, config);
            console.log(res.data.wishlist)
            if (res.status === 200) {
                dispatch({
                    type: GET_WISHLIST_ITEMS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_WISHLIST_ITEMS_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_WISHLIST_ITEMS_FAIL
            });
        }
    }
}

export const add_wishlist_item = product_id => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        const body = JSON.stringify({
            product_id
        });

        try {
            const res = await axios.post(`${apiURI}/api/wishlist/add-item`, body, config);

            if (res.status === 201) {
                dispatch({
                    type: ADD_WISHLIST_ITEM_SUCCESS,
                    payload: res.data
                });
                dispatch(setAlert('Product was added to wish list', 'green'));
            } else {
                dispatch({
                    type: ADD_WISHLIST_ITEM_FAIL
                });
                dispatch(setAlert('Something went wrong', 'red'));

            }
        } catch(err) {
            dispatch({
                type: ADD_WISHLIST_ITEM_FAIL
            });
            dispatch(setAlert('Something went wrong', 'red'));

        }
    }
}

export const get_wishlist_item_total = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        };
        try {
            const res = await axios.get(`${apiURI}/api/wishlist/get-item-total`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_WISHLIST_ITEM_TOTAL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_WISHLIST_ITEM_TOTAL_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_WISHLIST_ITEM_TOTAL_FAIL
            });
        }
    }
}

export const remove_wishlist_item = product_id => async dispatch => {
    if (localStorage.getItem('access')) {
        const body = JSON.stringify({
            product_id
        });

        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: body
        };

        try {
            const res = await axios.delete(`${apiURI}/api/wishlist/remove-item`, config);

            if (res.status === 200) {
                dispatch({
                    type: REMOVE_WISHLIST_ITEM_SUCCESS,
                    payload: res.data
                });
                dispatch(setAlert('Product was removed from wish list', 'green'));
                
            } else {
                dispatch({
                    type: REMOVE_WISHLIST_ITEM_FAIL
                });
                dispatch(setAlert('Something went wrong_1', 'red'));

            }
        } catch(err) {
            dispatch({
                type: REMOVE_WISHLIST_ITEM_FAIL
            });
            dispatch(setAlert('Something went wrong_2', 'red'));
        }
    }

}

export const clear_wishlist = () => dispatch => {
    dispatch({
        type: CLEAR_WISHLIST
    });
};