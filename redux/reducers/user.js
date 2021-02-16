const {
  SIGN_IN_SUCCESS,
  SIGN_IN_LOADING,
  SIGN_IN_ERROR,
  UPDATE_PROFILE,
  LOGOUT,
} = require("../actions/actionTypes");

const initialState = {
  first_name: null,
  last_name: null,
  email: null,
  avatar: null,
  gender: null,
  token: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SIGN_IN_SUCCESS:
      return {
        ...action.user,
        error: null,
        loading: false,
      };
    case SIGN_IN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        first_name: action.first_name,
        last_name: action.last_name,
        email: action.email,
        avatar: action.avatar + "?" + new Date().getTime(),
        gender: action.gender,
      };
    case LOGOUT:
      return {
        first_name: null,
        last_name: null,
        email: null,
        avatar: null,
        gender: null,
        token: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export default userReducer;
