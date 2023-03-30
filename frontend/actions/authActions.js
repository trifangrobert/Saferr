import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SERVER_URL } from "../config";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  AUTH_LOADING,
} from "./types";

// const SERVER_URL = process.env.SERVER_URL;
const SERVER_URL = "http://localhost:4000";

// Register user
export const registerUser =
  ({ firstName, lastName, email, password }) =>
  async (dispatch) => {
    console.log("registerUser action frontend");
    // firstName = "asds"
    // lastName = "asd"
    // email = "asd"
    // password = "password"

    console.log("firstName: ", firstName);
    console.log("lastName: ", lastName);
    console.log("email: ", email);
    console.log("password: ", password);
    console.log(JSON.stringify({ firstName, lastName, email, password }));
    try {
      dispatch({ type: AUTH_LOADING });
      console.log(`${SERVER_URL}/api/auth/register`);
      const res = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        dispatch({
          type: REGISTER_SUCCESS,
          payload: { user: data.user, token: data.token },
        });
      } else {
        dispatch({ type: REGISTER_FAILURE, payload: data.message });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: REGISTER_FAILURE,
        payload: "Server error. Please try again.",
      });
    }
  };

// Login user
export const loginUser =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      dispatch({ type: AUTH_LOADING });

      const res = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data.user, token: data.token },
        });
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: data.message });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: LOGIN_FAILURE,
        payload: "Server error. Please try again.",
      });
    }
  };

// Logout user
export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem("token");
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (error) {
    console.error(error);
  }
};
