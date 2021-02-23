import axios from '../../axios/axios';
import { FETCH_MESSAGES, FETCH_MESSAGES_ERROR, NEW_MESSAGE } from './actionTypes';

export const fetchMessages = (currentPage, pageSize, chatId) => {
    return async (dispatch, getState) => {
        const token = getState().user.token ? getState().user.token: localStorage.getItem('token');
        try {
            const {data} = await axios.get(`/chat/messages?currentPage=${currentPage}&pageSize=${pageSize}&chatId=${chatId}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            console.log('FETCH_MESSAGES', data);
            dispatch({
                type: FETCH_MESSAGES,
                messages: data.messages,
                currentPage: data.currentPage,
                pages: data.pages,
                pageSize: data.pageSize,
                chat_id: data.chat_id
            });
        } catch(err) {
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message;
            dispatch({
                type: FETCH_MESSAGES_ERROR,
                error: errorMessage
            });
        }
    };
};


export const sendMessage = (chatId, message, type) => {
    return async (dispatch, getState) => {
        try {
            const {data} = await axios.post(`/chat/sendMessage?chatId=${chatId}`, {
                message: message,
                messageType: type
            }, {
                headers: {
                    Authorization: 'Bearer ' + getState().user.token
                }
            });
            const result = await dispatch({
                type: NEW_MESSAGE,
                message: data,
                chat_id: chatId,
                latest_message_from: getState().user.first_name
            });
            return result;
        } catch(err) {
            console.log(err);
            // const errorMessage = err.response && err.response.data && err.response.data.message
            //     ? err.response.data.message
            //     : err.message;
            // dispatch({
            //     type: FETCH_MESSAGES_ERROR,
            //     error: errorMessage
            // });
        }
    };
};