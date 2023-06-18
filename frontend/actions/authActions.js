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
} from "./types";

const SERVER_URL = process.env.SERVER_URL;
console.log(process.env.SERVER_URL);

// register user
export const registerUser =
	({ firstName, lastName, email, password }) =>
		async (dispatch) => {
			console.log("registerUser action frontend");
			console.log(process.env.SERVER_URL);

			console.log(JSON.stringify({ firstName, lastName, email, password }));
			dispatch({ type: AUTH_LOADING });

			fetch(`${SERVER_URL}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, password }),
			})
				.then((res) => {
					// console.log("res: ", res);
					if (res.ok) {
						return res.json();
					} else {
						throw new Error("Something went wrong");
					}
				})
				.then((data) => {
					console.log("data: ", data);
					AsyncStorage.setItem("token", data.token);
					dispatch({
						type: REGISTER_SUCCESS,
						payload: { user: data.user, token: data.token },
					});
				})
				.catch((error) => {
					// console.error(error);
					dispatch({
						type: REGISTER_FAILURE,
						payload: "Server error. Please try again.",
					});
				});
		};

// login user
export const loginUser =
	({ email, password }) =>
		async (dispatch) => {
			dispatch({ type: AUTH_LOADING });

			console.log("loginUser action frontend");
			console.log(JSON.stringify({ email, password }));

			fetch(`${SERVER_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					else {
						throw new Error("Something went wrong");
					}
				})
				.then((data) => {
					console.log("data: ", data);
					AsyncStorage.setItem("token", data.token);
					dispatch({
						type: LOGIN_SUCCESS,
						payload: { user: data.user, token: data.token },
					});
				})
				.catch((error) => {
					console.error(error);
					dispatch({
						type: LOGIN_FAILURE,
						payload: "Server error. Please try again.",
					});
				});
		};

// logout user
export const logoutUser = () => async (dispatch) => {
	try {
		await AsyncStorage.removeItem("token");
		dispatch({ type: LOGOUT_SUCCESS });
	} catch (error) {
		console.error(error);
	}
};

// get user profile
export const getUserProfile = () => async (dispatch) => {
	console.log("getUserProfile action frontend");

	fetch(`${SERVER_URL}/api/auth/profile`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: email }),
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			else {
				throw new Error("Something went wrong");
			}
		}
		)
		.then((data) => {
			console.log("data: ", data);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: { user: data.user, token: data.token },
			});
		})
		.catch((error) => {
			console.error(error);
		}
		);
};

// update user coordinates
export const updateUserCoordinate = (email, coordinate) => async (dispatch) => {
	console.log("updateUserCoordinate action frontend");

	dispatch({ type: UPDATE_COORDINATE_LOADING });

	console.log(JSON.stringify({ email, coordinate }));

	fetch(`${SERVER_URL}/api/auth/update/coordinate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: email, coordinate: coordinate }),
	})
		.then((res) => {
			// console.log(res);
			if (res.ok) {
				return res.json();
			}
			else {
				throw new Error("Something went wrong");
			}
		})
		.then((data) => {
			console.log("data: ", data);
			dispatch({
				type: UPDATE_COORDINATE_SUCCESS,
				payload: { user: data.user, token: data.token },
			});
		})
		.catch((error) => {
			console.error(error);
			dispatch({
				type: UPDATE_COORDINATE_FAILURE,
				payload: "Server error. Please try again.",
			});
		});
};