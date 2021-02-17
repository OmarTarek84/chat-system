import { FETCH_CHATS_SUCCESS, FETCH_CHATS_ERROR, FETCH_CHATS_LOADING } from "../actions/actionTypes";

const initialState = {
    chats: [],
    chatLoading: false,
    chatError: null
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
        default:
            return state;
    }
};

export default chatReducer;