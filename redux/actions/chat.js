import axios from '../../axios/axios';
import { ADD_CHAT, ADD_USERS_TO_CHAT, DELETE_CHAT, FETCH_CHATS_ERROR, FETCH_CHATS_LOADING, FETCH_CHATS_SUCCESS, LEAVE_CHAT } from './actionTypes';

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


export const addChat = (users) => {
    return async (dispatch, getState) => {
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.post('chat/add', {users}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const result = await dispatch({
                type: ADD_CHAT,
                chat: data
            });
            console.log('CHATS ADDED', data);
            return result;
        } catch(err) {
            console.log(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
        }
    };
};


export const deleteChat = chatId => {
    return async (dispatch, getState) => {
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.delete(`chat/delete?chatId=${chatId}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const result = await dispatch({
                type: DELETE_CHAT,
                chat_id: data.chatId
            });
            console.log('CHATS DELETED', data);
            return result;
        } catch(err) {
            console.log(err);
        }
    };
};


export const addUsersToChat = (chatId, users) => {
    return async (dispatch, getState) => {
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.post(`chat/addUserToChat?chatId=${chatId}`, {users}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const result = await dispatch({
                type: ADD_USERS_TO_CHAT,
                chatId: chatId,
                addedUsers: data
            });
            console.log('USERS ADDED TO CHATS', data);
            return result;
        } catch(err) {
            console.log(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
        }
    };
};


export const leaveChat = chatId => {
    return async (dispatch, getState) => {
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.put(`chat/leaveChat?chatId=${chatId}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const result = await dispatch({
                type: LEAVE_CHAT,
                chatId: chatId,
                userEmail: getState().user.email
            });
            // console.log('LEAVE FROM CHATS', data);
            return result;
        } catch(err) {
            console.log(err);
        }
    };
};