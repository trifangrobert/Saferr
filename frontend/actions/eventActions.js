import {
    ADD_EVENT_FAILURE,
    ADD_EVENT_LOADING,
    ADD_EVENT_SUCCESS,
    GET_EVENTS_FAILURE,
    GET_EVENTS_LOADING,
    GET_EVENTS_SUCCESS,
    UPDATE_EVENT_FAILURE,
    UPDATE_EVENT_LOADING,
    UPDATE_EVENT_SUCCESS,
} from './types';

const SERVER_URL = process.env.SERVER_URL;
console.log(SERVER_URL);

export const createEvent = ({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }) => async (dispatch) => {
    console.log('createEvent action frontend');
    console.log(JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }));
    dispatch({ type: ADD_EVENT_LOADING });

    fetch(`${SERVER_URL}/api/event/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }),
    })
        .then((res) => {
            // console.log('res: ', res);
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then((data) => {
            console.log('data: ', data);
            dispatch({
                type: ADD_EVENT_SUCCESS,
                payload: data,
            });
        })
        .catch((error) => {
            console.error(error);
            dispatch({
                type: ADD_EVENT_FAILURE,
                payload: 'Server error. Please try again.',
            });
        });
}

export const getEvents = () => async (dispatch) => {
    console.log('getEvents action frontend');
    dispatch({ type: GET_EVENTS_LOADING });

    fetch(`${SERVER_URL}/api/event/all`)
        .then((res) => {
            // console.log('res: ', res);
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then((data) => {
            // console.log('data: ', data);
            dispatch({
                type: GET_EVENTS_SUCCESS,
                payload: data,
            });
        })
        .catch((error) => {
            console.error(error);
            dispatch({
                type: GET_EVENTS_FAILURE,
                payload: 'Server error. Please try again.',
            });
        });
}

export const updateEvent = (eventId, { typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }) => async (dispatch) => {
    console.log('updateEvent action frontend');
    console.log(JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }));
    dispatch({ type: UPDATE_EVENT_LOADING });

    fetch(`${SERVER_URL}/api/event/update/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }),
    })
        .then((res) => {
            // console.log('res: ', res);
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then((data) => {
            console.log('data: ', data);
            dispatch({
                type: UPDATE_EVENT_SUCCESS,
                payload: data,
            });
        })
        .catch((error) => {
            console.error(error);
            dispatch({
                type: UPDATE_EVENT_FAILURE,
                payload: 'Server error. Please try again.',
            });
        });
}