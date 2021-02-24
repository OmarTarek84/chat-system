import { DELETE_CHAT, FETCH_MESSAGES, FETCH_MESSAGES_ERROR, LOGOUT, NEW_MESSAGE } from "../actions/actionTypes";

const initialState = {
  messages: [],
  currentPage: 1,
  pageSize: 30,
  pages: 2,
  chat_id: null,
  total_number_of_messages: 30,
  messagesError: null
};

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return {
        ...state,
        messages: action.chat_id == state.chat_id ? [...action.messages.reverse(), ...state.messages]: [...action.messages.reverse()],
        currentPage: action.currentPage,
        pageSize: action.pageSize,
        chat_id: action.chat_id,
        pages: action.pages,
        messagesError: null,
        total_number_of_messages: action.messages[0] ? action.messages[0].total_number_of_messages: 0
      };
    case FETCH_MESSAGES_ERROR:
      return {
        ...state,
        messagesError: action.error
      };
    case NEW_MESSAGE:
      let newMsgs;
      if (state.messages.length >= state.pageSize && state.pages > state.currentPage) {
        newMsgs = [...state.messages.slice(1), action.message];
      } else {
        newMsgs = [...state.messages, action.message];
      }
      return {
        ...state,
        messages: newMsgs
      };
    case LOGOUT:
      return {
        messages: [],
        currentPage: 1,
        pageSize: 30,
        pages: 2,
        chat_id: 1,
        total_number_of_messages: 30,
        messagesError: null
      };
    case DELETE_CHAT:
      return {
        messages: [],
        currentPage: 1,
        pageSize: 30,
        pages: 2,
        chat_id: 1,
        total_number_of_messages: 30,
        messagesError: null
      };
    default:
      return state;
  }
};

export default messagesReducer;