import chatReducer from "./chat";
import userReducer from "./user";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer
});

export default rootReducer;