import {
    ADD_EVENT_FAILURE,
    ADD_EVENT_LOADING,
    ADD_EVENT_SUCCESS,
    GET_EVENTS_FAILURE,
    GET_EVENTS_LOADING,
    GET_EVENTS_SUCCESS,
} from './types';

import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { setSelectedMarker, setShowRoute } from './mapActions';
import { even } from '@react-native-material/core';


const SERVER_URL = process.env.SERVER_URL;

export const createEvent = ({ typeOfCrime, crimeDescription, coordinate, date, email }) => async (dispatch) => {
    console.log('createEvent action frontend');
    console.log(JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email }));
    dispatch({ type: ADD_EVENT_LOADING });

    const policeOfficerLocation = await getCurrentLocation();

    fetch(`${SERVER_URL}/api/event/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email }),
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

            // alert any police officers that are nearby
            console.log('coordinate: ', data.event.coordinate);
            sendAlert(data.event, policeOfficerLocation);
        })
        .catch((error) => {
            console.error(error);
            dispatch({
                type: ADD_EVENT_FAILURE,
                payload: 'Server error. Please try again.',
            });
        });
}

const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
            .then((location) => {
                resolve(location);
            })
            .catch((error) => {
                console.log('error: ', error);
                reject(error);
            });
    });
};

const calculateDistance = (coordinate1, coordinate2) => {
    const lat1 = coordinate1.latitude * (Math.PI / 180);
    const lon1 = coordinate1.longitude * (Math.PI / 180);
    const lat2 = coordinate2.latitude * (Math.PI / 180);
    const lon2 = coordinate2.longitude * (Math.PI / 180);

    const R = 6371; // in km
    const latDiff = lat2 - lat1;
    const lonDiff = lon2 - lon1;

    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

const sendAlert = (event, policeOfficerLocation) => {
    console.log('sendAlert');
    console.log('eventCoordinate: ', event.coordinate);
    console.log('policeOfficerLocation: ', policeOfficerLocation);

    const distance = calculateDistance(event.coordinate, policeOfficerLocation.coords);
    console.log('distance: ', distance);

    if (distance < 1) {
        Alert.alert(
            'New Crime Reported',
            `There has been a crime reported near you. Time to be a hero! Title: ${event.typeOfCrime}\n Description: ${event.crimeDescription}`,
            [
                {
                    text: 'Dismiss',
                    style: 'cancel',
                },
                {
                    text: 'Show route',
                    onPress: () => {
                        console.log('show route');
                        setShowRoute(true);
                        setSelectedMarker( { coordinate: event.coordinate });
                    },
                },
            ],
            { cancelable: false },
        );
        console.log('send alert');
        console.log('A crime has been reported near you. Please check the app for more details.');
        console.log('Coordinate: ', event.coordinate);
        console.log('Police officer location: ', policeOfficerLocation);
    }
};


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

