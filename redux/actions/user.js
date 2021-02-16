import axios from '../../axios/axios';
import { SIGN_IN_ERROR, SIGN_IN_LOADING, SIGN_IN_SUCCESS, UPDATE_PROFILE } from './actionTypes';

export const signin = formData => {
    return async dispatch => {
        dispatch({
            type: SIGN_IN_LOADING
        });

        try {
            const {data} = await axios.put('/auth/login', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('firstName', data.first_name);
            localStorage.setItem('lastName', data.last_name);
            const result = await dispatch({
                type: SIGN_IN_SUCCESS,
                user: data
            });
            return result;
        } catch(err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
            dispatch({
                type: SIGN_IN_ERROR,
                error: errorMessage
            });
        }
    };
};


export const updateProfile = formData => {
    return async (dispatch, getState) => {
        const {data} = await axios.put('/user/update', formData, {
            headers: {
                Authorization: 'Bearer ' + getState().user.token
            }
        });

        dispatch({
            type: UPDATE_PROFILE,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            avatar: data.avatar,
            gender: data.gender,
        });
    };
};