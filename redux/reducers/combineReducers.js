const { combineReducers } = require("redux");
const { default: userReducer } = require("./user");

const rootReducer = combineReducers({
    user: userReducer
});

export default rootReducer;