import { FETCH_CHATS_SUCCESS, FETCH_CHATS_ERROR, FETCH_CHATS_LOADING, LOGOUT, NEW_MESSAGE } from "../actions/actionTypes";

const initialState = {
    chats: [],
    chatLoading: false,
    chatError: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CHATS_LOADING:
            return {
                ...state,
                chatError: null,
                chatLoading: true
            };
        case FETCH_CHATS_SUCCESS:
            return {
                ...state,
                chats: action.chats,
                chatLoading: false,
            };
        case FETCH_CHATS_ERROR:
            return {
                ...state,
                chatError: null,
                chatLoading: false,
            };
        case NEW_MESSAGE:
            const allChats = [...state.chats];
            const foundChatIndex = allChats.findIndex(c => c.chatdetails.chat_id == action.chat_id);
            if (foundChatIndex > -1) {
                allChats[foundChatIndex].chatdetails.latest_message = action.message.message;
                allChats[foundChatIndex].chatdetails.latest_message_from = action.latest_message_from;
            }
            return {
                ...state,
                chats: allChats
            };
        case LOGOUT:
            return {
                chats: [],
                chatLoading: false,
                chatError: null,
            };
        default:
            return state;
    }
};

export default chatReducer;