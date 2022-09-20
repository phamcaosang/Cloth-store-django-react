import axios from 'axios';
import toast from 'react-hot-toast';
import { apiURI } from '../../helpers/requestServer';
import {
    ADD_ITEM,
    GET_TOTAL,
    GET_ITEM_TOTAL,
    GET_ITEMS,
    UPDATE_ITEM,
    REMOVE_ITEM,
    EMPTY_CART,
    ADD_ITEM_SUCCESS,
    ADD_ITEM_FAIL,
    GET_TOTAL_SUCCESS,
    GET_TOTAL_FAIL,
    GET_ITEM_TOTAL_SUCCESS,
    GET_ITEM_TOTAL_FAIL,
    GET_ITEMS_SUCCESS,
    GET_ITEMS_FAIL,
    UPDATE_ITEM_SUCCESS,
    UPDATE_ITEM_FAIL,
    REMOVE_ITEM_SUCCESS,
    REMOVE_ITEM_FAIL,
    EMPTY_CART_SUCCESS,
    EMPTY_CART_FAIL,
    SYNCH_CART_SUCCESS,
    SYNCH_CART_FAIL,
} from './types';


export const add_item = product => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        const product_id = product.id;
        const size = product.size
        const body = JSON.stringify({ product_id, size });
        console.log(body)

        try {
            const res = await axios.post(`${apiURI}/api/cart/add-item`, body, config);

            if (res.status === 201) {
                dispatch({
                    type: ADD_ITEM_SUCCESS,
                    payload: res.data
                });
                toast.success("Add item successfully")
            } else {
                dispatch({
                    type: ADD_ITEM_FAIL
                });
                toast.error("Add item failed")
            }
        } catch(err){
            dispatch({
                type: ADD_ITEM_FAIL
            });
            toast.error("Add item failed")
        }

    } else {
        let cart = [];

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        let shouldAddItem = true;

        cart.map(item => {
            if (product.id.toString() === item.product.id.toString()) {
                if (product.size.toString() === item.product.size.toString()){
                    shouldAddItem = false;
                }
            }
        });

        const order_item = {
            product: product,
            count: 1
        };

        if (shouldAddItem) {
            cart.push(order_item);
            dispatch({
                type: ADD_ITEM,
                payload: cart
            });
            toast.success("Product added to cart")
        }else{
           toast.error("product already exist") 
        }

    }
}


export const get_items = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        try {
            const res = await axios.get(`${apiURI}/api/cart/cart-items`, config);
            if (res.status === 200) {
                dispatch({
                    type: GET_ITEMS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ITEMS_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ITEMS_FAIL
            });
        }
    } else {
        dispatch({
            type: GET_ITEMS
        });
    }
}

export const get_total = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        try {
            const res = await axios.get(`${apiURI}/api/cart/get-total`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_TOTAL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_TOTAL_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_TOTAL_FAIL
            });
        }
    } else {
        let total = 0.0;
        let compare_total = 0.0;
        let cart = [];

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));

            cart.map(item => {
                total += parseFloat(item.product.price) * parseFloat(item.count);
                compare_total += parseFloat(item.product.compare_price) * parseFloat(item.count);
            });
        }

        dispatch({
            type: GET_TOTAL,
            payload: [parseFloat(total.toFixed(2)), parseFloat(compare_total.toFixed(2))]
        });
    }
}


export const get_item_total = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        try {
            const res = await axios.get(`${apiURI}/api/cart/get-item-total`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ITEM_TOTAL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ITEM_TOTAL_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ITEM_TOTAL_FAIL
            });
        }
    } else {
        let total = 0;

        if (localStorage.getItem('cart')) {
            total = JSON.parse(localStorage.getItem('cart')).length;
        }

        dispatch({
            type: GET_ITEM_TOTAL,
            payload: total
        });
    }
}

export const update_item = (item, count) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        const product_id = item.product.id;
        const size = item.product.size;
        const body = JSON.stringify({ product_id, size, count});

        try {
            const res = await axios.put(`${apiURI}/api/cart/update-item`, body, config);

            if (res.status === 200 && !res.data.error) {
                dispatch({
                    type: UPDATE_ITEM_SUCCESS,
                    payload: res.data
                });
                toast.success("Cart updated")
            } else {
                dispatch({
                    type: UPDATE_ITEM_FAIL
                });
                toast.error("Fail to update cart")
            }
        } catch(err) {
            dispatch({
                type: UPDATE_ITEM_FAIL
            });
            toast.error("Fail to update cart")
        }

    } else {
        let cart = [];

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));

            cart.map((cart_item, index) => {
                if (cart_item.product.id.toString() === item.product.id.toString()) {
                    if(cart_item.product.size === item.product.size){
                        cart[index].count = parseInt(count);
                    }
                }
            });
        }

        dispatch({
            type: UPDATE_ITEM,
            payload: cart
        });
        toast.success("Cart updated")
    }
}


export const remove_item = item => async dispatch => {
    if (localStorage.getItem('access')) {
        const product_id = item.product.id;
        const size = item.product.size
        const body = JSON.stringify({ product_id, size });


        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            },
            data: body
        };
        console.log(body)
        try {
            const res = await axios.delete(`${apiURI}/api/cart/remove-item`, config);

            if (res.status === 200) {
                dispatch({
                    type: REMOVE_ITEM_SUCCESS,
                    payload: res.data
                });
                toast.success("Product removed")
            } else {
                dispatch({
                    type: REMOVE_ITEM_FAIL
                });
                toast.error("Failed to remove product")
            }
        } catch(err) {
            dispatch({
                type: REMOVE_ITEM_FAIL
            });
            toast.error("Failed to remove product")
        }
    } else {
        let cart = [];
        let new_cart = [];

        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            console.log(cart)
            console.log(item)
            for (let cart_item of cart){
                if (cart_item.product.id.toString() === item.product.id.toString()){
                    if (cart_item.product.size === item.product.size){
                        continue
                    }
                }
                new_cart.push(cart_item)
            }
        }

        dispatch({
            type: REMOVE_ITEM,
            payload: new_cart
        });
        toast.success("Product removed")

    }
}

export const empty_cart = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        try {
            const res = await axios.delete(`${apiURI}/api/cart/empty-cart`, config);

            if (res.status === 200) {
                dispatch({
                    type: EMPTY_CART_SUCCESS
                });
            } else {
                dispatch({
                    type: EMPTY_CART_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: EMPTY_CART_FAIL
            });
        }
    } else {
        dispatch({
            type: EMPTY_CART
        });
    }
}


export const synch_cart = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`,
        }
    };

    let cart_items = [];

    if (localStorage.getItem('cart')) {
        let cart = JSON.parse(localStorage.getItem('cart'));

        cart.map(cart_item => {
            const item = {};
            item.product_id = cart_item.product.id;
            item.size = cart_item.product.size
            item.count = cart_item.count;
            cart_items.push(item);
        });
    }

    const body = JSON.stringify({ cart_items });

    try {
        const res = await axios.put(`${apiURI}/api/cart/synch`, body, config);

        if (res.status === 201) {
            dispatch({
                type: SYNCH_CART_SUCCESS
            });
        } else {
            dispatch({
                type: SYNCH_CART_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: SYNCH_CART_FAIL
        });
    }
}