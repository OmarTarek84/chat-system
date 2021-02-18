import chatReducer from "./chat";
import messagesReducer from "./messages";
import userReducer from "./user";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    message: messagesReducer
});

export default rootReducer;