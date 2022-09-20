import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT
} from './types'
import {AccessToken, RefreshToken} from "../../hocs/Token" 
import { setAlert } from './alert';
import axios from 'axios'
import { apiURI } from '../../helpers/requestServer';

export const check_authenticated = () => async dispatch => {
    if(AccessToken.token){
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify(AccessToken);

        try {
            const res = await axios.post(`${apiURI}/auth/jwt/verify/`, body, config);

            if (res.status === 200) {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch(err){
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        console.log("Not found access")
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}

export const signup = (first_name, last_name, email, password, re_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        re_password
    });

    try {
        const res = await axios.post(`${apiURI}/auth/users/`, body, config);
        console.log("test_1")
        if (res.status === 201) {
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data
            });
            dispatch(setAlert('We have sent you an email, please activate your account. Check spam mail','green'))
        } else {
            dispatch({
                type: SIGNUP_FAIL
            });
            dispatch(setAlert('Failed to create account', 'red'));
        }
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
    } catch (err) {
        let error_data = err.response.data
        let key_error = Object.keys(error_data)[0]
        dispatch({
            type: SIGNUP_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        if (key_error){
            dispatch(setAlert(error_data[key_error][0], 'red', 7000));
        } else{
            dispatch(setAlert('Error connecting to server, please try again later.', 'red'));
        }
    }
};

export const load_user = () => async dispatch => {
    if(AccessToken.token){
        const config = {
            headers: {
                'Authorization': `JWT ${AccessToken.token}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${apiURI}/auth/users/me/`, config);
        
            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: USER_LOADED_FAIL
                });
            }
        }
        catch(err){
            dispatch({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
}

export const login = (email, password, setActivated) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        email,
        password
    });

    try {
        const res = await axios.post(`${apiURI}/auth/jwt/create/`, body, config);
        if (res.status === 200) {
            console.log("ok_1")
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            console.log("ok_2")
            dispatch(load_user());
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Successful login', 'green'));
            setActivated(true)
        } else {
            console.log("fail")
            dispatch({
                type: LOGIN_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Failed to login.', 'red'));
            setActivated(false)
        }
    }
    catch(err){
        console.log(err)
        dispatch({
            type: LOGIN_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Failed to login. try later', 'red'));
    }
}

export const activate = (uid, token) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token
    });

    try {
        const res = await axios.post(`${apiURI}/auth/users/activation/`, body, config);
    
        if (res.status === 204) {
            dispatch({
                type: ACTIVATION_SUCCESS
            });
            dispatch(setAlert('Account activated successfully', 'green'));
        } else {
            dispatch({
                type: ACTIVATION_FAIL
            });
            dispatch(setAlert('Error activating account', 'red'));
        }
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
    }
    catch(err){
        dispatch({
            type: ACTIVATION_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error connecting to server, please try again later.', 'red'));
    }
};

export const refresh = () => async dispatch => {
    if (RefreshToken.token) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify({
            'refresh': RefreshToken.token
        });
        console.log(body)

        try {
            const res = await axios.post(`${apiURI}/auth/jwt/refresh/`, body, config);
            console.log("test")
            if (res.status === 200) {
                dispatch({
                    type: REFRESH_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: REFRESH_FAIL
                });
                console.log("status wrong")
            }
        }catch(err){
            dispatch({
                type: REFRESH_FAIL
            });
            console.log("something went wrong")
            console.log(err)
        }
    } else {
        dispatch({
            type: REFRESH_FAIL
        });
        console.log("Not found refresh")
    }
}

export const reset_password = (email) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try{
        const res = await axios.post(`${apiURI}/auth/users/reset_password/`, body, config);
        
        if (res.status === 204) {
            dispatch({
                type: RESET_PASSWORD_SUCCESS
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Password reset email sent', 'green'));
        } else {
            dispatch({
                type: RESET_PASSWORD_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Error sending password reset email', 'red'));
        }
    }
    catch(err){
        dispatch({
            type: RESET_PASSWORD_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Error sending password reset email', 'red'));
    }
}

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({
        type: SET_AUTH_LOADING
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
    });

    if (new_password !== re_new_password) {
        dispatch({
            type: RESET_PASSWORD_CONFIRM_FAIL
        });
        dispatch({
            type: REMOVE_AUTH_LOADING
        });
        dispatch(setAlert('Passwords do not match', 'red'));
    } else {
        try {
            const res = await axios.post(`${apiURI}/auth/users/reset_password_confirm/`, body, config);
        
            if (res.status === 204) {
                dispatch({
                    type: RESET_PASSWORD_CONFIRM_SUCCESS
                });
                dispatch({
                    type: REMOVE_AUTH_LOADING
                });
                dispatch(setAlert('Password has been reset successfully', 'green'));
            } else {
                dispatch({
                    type: RESET_PASSWORD_CONFIRM_FAIL
                });
                dispatch({
                    type: REMOVE_AUTH_LOADING
                });
                dispatch(setAlert('Error resetting your password', 'red'));
            }
        } catch(err){
            dispatch({
                type: RESET_PASSWORD_CONFIRM_FAIL
            });
            dispatch({
                type: REMOVE_AUTH_LOADING
            });
            dispatch(setAlert('Error resetting your password', 'red'));
        }
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
    dispatch(setAlert('Succesfully logged out', 'green'));
}