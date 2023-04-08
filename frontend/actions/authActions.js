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

const SERVER_URL = "http://10.243.59.96:4000";

// Register user
export const registerUser =
  ({ firstName, lastName, email, password }) =>
  async (dispatch) => {
    console.log("registerUser action frontend");
    // firstName = "Robert";
    // lastName = "Trifan";
    // email = "trifangrobert@gmail.com";
    // password = "qwertyui";

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

// Login user
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
    

    // try {
    //   dispatch({ type: AUTH_LOADING });

    //   const res = await fetch(`${SERVER_URL}/api/auth/login`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await res.json();

    //   if (res.ok) {
    //     await AsyncStorage.setItem("token", data.token);
    //     dispatch({
    //       type: LOGIN_SUCCESS,
    //       payload: { user: data.user, token: data.token },
    //     });
    //   } else {
    //     dispatch({
    //       type: LOGIN_FAILURE,
    //       payload: data.message,
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   dispatch({
    //     type: LOGIN_FAILURE,
    //     payload: "Server error. Please try again.",
    //   });
    // }
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
