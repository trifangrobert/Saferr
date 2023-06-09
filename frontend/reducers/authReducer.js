import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	REGISTER_SUCCESS,
	REGISTER_FAILURE,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT_SUCCESS,
	AUTH_LOADING,
	UPDATE_COORDINATE_FAILURE,
	UPDATE_COORDINATE_LOADING,
	UPDATE_COORDINATE_SUCCESS
} from "../actions/types";

const initialState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
			AsyncStorage.setItem("token", action.payload.token);
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			};
		case REGISTER_FAILURE:
		case LOGIN_FAILURE:
			AsyncStorage.removeItem("user");
			AsyncStorage.removeItem("token");
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: action.payload,
			};
		case LOGOUT_SUCCESS:
			AsyncStorage.removeItem("user");
			AsyncStorage.removeItem("token");
			return {
				...state,
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			};
		case AUTH_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case UPDATE_COORDINATE_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case UPDATE_COORDINATE_SUCCESS:
			return {
				// change state.user.coordinate to action.payload.coordinate
				...state,
				isLoading: false,
				user: {
					...state.user,
					coordinate: action.payload.coordinate,
				}
			};
		case UPDATE_COORDINATE_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export default authReducer;
