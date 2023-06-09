import * as Location from 'expo-location';
import { Alert } from 'react-native';
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
	DELETE_EVENT_FAILURE,
	DELETE_EVENT_LOADING,
	DELETE_EVENT_SUCCESS,
	SET_NEWEST_EVENT,
	GET_POLICE_OFFICERS_FAILURE,
	GET_POLICE_OFFICERS_LOADING,
	GET_POLICE_OFFICERS_SUCCESS,
	GET_CITIZENS_FAILURE,
	GET_CITIZENS_LOADING,
	GET_CITIZENS_SUCCESS
} from './types';

const SERVER_URL = process.env.SERVER_URL;
console.log(SERVER_URL);

// create event
export const createEvent = ({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }, showRoute) => async (dispatch) => {
	console.log('createEvent action frontend');
	console.log(JSON.stringify({ typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes }));
	dispatch({ type: ADD_EVENT_LOADING });

	const policeOfficers = await getPoliceOfficersLocal();
	console.log(JSON.stringify(policeOfficers));

	// here police officers does not have a location

	// get the closest officers to the coordinate
	const closestOfficers = policeOfficers.filter((officer) => {
		return calculateDistance(officer.coordinate, coordinate) < 50;
	});

	console.log('closestOfficers: ', closestOfficers);

	// const policeOfficerLocation = getCurrentLocation();

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
			// here showRoute undefined

			console.log('data: ', data, '\nshowRoute: ', showRoute);
			dispatch({
				type: ADD_EVENT_SUCCESS,
				payload: data,
			});

			// alert any police officers that are nearby
			console.log('coordinate: ', data.event.coordinate);

			// sendAlert(data.event, policeOfficerLocation, dispatch);

			for (const policeOfficer of closestOfficers) {
				sendAlert(data.event, policeOfficer, dispatch);
				// error on sending to another device
				break;
			}
		})
		.catch((error) => {
			console.error(error);
			dispatch({
				type: ADD_EVENT_FAILURE,
				payload: 'Server error. Please try again.',
			});
		});
}

// get police officers for create event function
const getPoliceOfficersLocal = () => {
	console.log('get police officers local frontend');

	return new Promise((resolve, reject) => {
		fetch(`${SERVER_URL}/api/auth/policeOfficers`)
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
				resolve(data);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
};

// get police officers from database
export const getPoliceOfficers = () => async (dispatch) => {
	console.log('get police officers frontend');
	dispatch({ type: GET_POLICE_OFFICERS_LOADING });

	fetch(`${SERVER_URL}/api/auth/policeOfficers`)
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
				type: GET_POLICE_OFFICERS_SUCCESS,
				payload: data,
			});
		})
		.catch((error) => {
			console.error(error);
			dispatch({
				type: GET_POLICE_OFFICERS_FAILURE,
				payload: 'Server error. Please try again.',
			});
		});
};

// get citizens from database
export const getCitizens = () => async (dispatch) => {
	console.log('get citizens frontend');
	dispatch({ type: GET_CITIZENS_LOADING });

	fetch(`${SERVER_URL}/api/auth/citizens`)
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
				type: GET_CITIZENS_SUCCESS,
				payload: data,
			});
		})
		.catch((error) => {
			console.error(error);
			dispatch({
				type: GET_CITIZENS_FAILURE,
				payload: 'Server error. Please try again.',
			});
		});
};

// const getCurrentLocation = () => {
//     return new Promise((resolve, reject) => {
//         Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
//             .then((location) => {
//                 resolve(location);
//             })
//             .catch((error) => {
//                 console.log('error: ', error);
//                 reject(error);
//             });
//     });
// };

// function that calculates distance between two coordi
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

// send alert to police officer
const sendAlert = (event, policeOfficerLocation, dispatch) => {
	console.log('sendAlert');
	console.log('eventCoordinate: ', event.coordinate);
	console.log('policeOfficerLocation: ', policeOfficerLocation);

	console.log('event.coordinate: ', event.coordinate, '\npoliceOfficerLocation: ', policeOfficerLocation);
	const distance = calculateDistance(event.coordinate, policeOfficerLocation.coordinate);
	console.log('distance: ', distance);

	if (distance < 1) {
		Alert.alert(
			'New Crime Reported',
			`There has been a crime reported near you.\nTime to be a hero!\nTitle: ${event.typeOfCrime}\nDescription: ${event.crimeDescription}`,
			[
				{
					text: 'Dismiss',
					style: 'cancel',
				},
				{
					text: 'Go to event',
					onPress: () => {
						console.log(`show route, coordinate: ${event.coordinate}, activeMarker: ${event.activeMarker}`);
						dispatch({
							type: SET_NEWEST_EVENT,
							payload: event,
						})
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

// get events from database
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

// update event in database
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

// delete event from database
export const deleteEvent = (EventId) => async (dispatch) => {
	console.log('deleteEvent action frontend');
	dispatch({ type: DELETE_EVENT_LOADING });

	fetch(`${SERVER_URL}/api/event/delete/${EventId}`, {
		method: 'DELETE',
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
				type: DELETE_EVENT_SUCCESS,
				payload: data,
			});
		})
		.catch((error) => {
			console.error(error);
			dispatch({
				type: DELETE_EVENT_FAILURE,
				payload: 'Server error. Please try again.',
			});
		});
}