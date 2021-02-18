import axios from '../../axios/axios';
import { FETCH_CHATS_ERROR, FETCH_CHATS_LOADING, FETCH_CHATS_SUCCESS } from './actionTypes';

export const fetchChats = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: FETCH_CHATS_LOADING
        });
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.get('chat', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const result = await dispatch({
                type: FETCH_CHATS_SUCCESS,
                chats: data
            });
            console.log('CHATS FETCH', data);
            return result;
        } catch(err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
            dispatch({
                type: FETCH_CHATS_ERROR,
                error: errorMessage
            });
        }
    };
};
