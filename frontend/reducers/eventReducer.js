import {
    ADD_EVENT_LOADING,
    ADD_EVENT_SUCCESS,
    ADD_EVENT_FAILURE,
    GET_EVENTS_LOADING,
    GET_EVENTS_SUCCESS,
    GET_EVENTS_FAILURE,
    UPDATE_EVENT_FAILURE,
    UPDATE_EVENT_LOADING,
    UPDATE_EVENT_SUCCESS,
    DELETE_EVENT_FAILURE,
    DELETE_EVENT_LOADING,
    DELETE_EVENT_SUCCESS,
    SET_NEWEST_EVENT,
} from '../actions/types';

const initialState = { 
    isLoading: false,
    error: null,
    events: [],
    newestEvent: null,
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EVENT_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case ADD_EVENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                events: [...state.events, action.payload.event],
            };
        case ADD_EVENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case GET_EVENTS_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case GET_EVENTS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                events: action.payload,
            };
        case GET_EVENTS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case UPDATE_EVENT_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case UPDATE_EVENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                events: [...state.events, action.payload.event],
            };
        case UPDATE_EVENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case DELETE_EVENT_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case DELETE_EVENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                events: state.events.filter((event) => event._id !== action.payload._id),
            };
        case DELETE_EVENT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case SET_NEWEST_EVENT:
            return {
                ...state,
                newestEvent: action.payload,
                events: [...state.events, action.payload]
            };
        default:
            return state;
    }
}

export default eventReducer;