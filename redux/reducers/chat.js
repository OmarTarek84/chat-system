import { FETCH_CHATS_SUCCESS, FETCH_CHATS_ERROR, FETCH_CHATS_LOADING, LOGOUT, NEW_MESSAGE, ADD_CHAT, DELETE_CHAT, ADD_USERS_TO_CHAT, LEAVE_CHAT } from "../actions/actionTypes";

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
        case ADD_CHAT:
            return {
                ...state,
                chats: [...state.chats, action.chat]
            };
        case LOGOUT:
            return {
                chats: [],
                chatLoading: false,
                chatError: null,
        };
        case DELETE_CHAT:
            const allChatsT = [...state.chats];
            const filteredChats = allChatsT.filter(chat => chat.chatdetails.chat_id != action.chat_id);
            return {
                ...state,
                chats: filteredChats
            };
        case ADD_USERS_TO_CHAT:
            const allAChats = [...state.chats];
            const targetChatIndex = allAChats.findIndex(c => c.chatdetails.chat_id == action.chatId);
            if (targetChatIndex > -1) {
                allAChats[targetChatIndex].chatdetails.chat_type = 'group';
                allAChats[targetChatIndex].chatdetails.users.push(...action.addedUsers);
            }
            return {
                ...state,
                chats: allAChats
            };
        case LEAVE_CHAT:
            const allChatsToFetch = [...state.chats];
            const targetChatFIndex = allChatsToFetch.findIndex(c => c.chatdetails.chat_id == action.chatId);
            allChatsToFetch.splice(targetChatFIndex, 1);
            return {
                ...state,
                chats: allChatsToFetch
            };
        default:
            return state;
    }
};

export default chatReducer;