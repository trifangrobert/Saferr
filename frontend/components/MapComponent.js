import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useState, useRef, useEffect } from "react";
import * as TaskManager from 'expo-task-manager';
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Modal, useColorModeValue, VStack, Button, Icon, Text, StatusBar } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import ToggleAddEventButton from "./buttons/ToggleAddEventButton";
import { getEvents, getPoliceOfficers, updateEvent, deleteEvent, getCitizens } from "../actions/eventActions";
import { updateUserCoordinate } from "../actions/authActions";

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

// const LOCATION_TRACKING = 'location-tracking';
// const LOCATION_UPDATE = 'location-update';

const MapComponent = () => {
	const navigation = useNavigation();
	const [position, setPosition] = useState({
		latitude: 44.435432,
		longitude: 26.102641,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	const [reportMarker, setReportMarker] = useState(null);
	const [showRoute, setShowRoute] = useState(false);
	const [enableReportEvent, setEnableReportEvent] = useState(false);

	// const mapViewRef = useRef(null);

	const [activeMarker, setActiveMarker] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [userPosition, setUserPosition] = useState(null);

	const dispatch = useDispatch();

	// dispatch get events  
	const { events: markers } = useSelector((state) => state.eventReducer);

	// dispatch get police officers
	const { policeOfficers: policeOfficersMarkers } = useSelector((state) => state.eventReducer);

	// dispatch get citizens
	const { citizens: citizens } = useSelector((state) => state.eventReducer);

	const { user } = useSelector((state) => state.authReducer);
	const { isAuthenticated } = useSelector((state) => state.authReducer);
	const { newestEvent } = useSelector((state) => state.eventReducer);

	const isFocused = useIsFocused();

	useEffect(() => {
		// request permission to access location
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}
		})();

		getLocation();
	}, []);

	useEffect(() => {
		setEnableReportEvent(false);
		setShowRoute(false);
		setActiveMarker(null);
	}, [isFocused]);

	useEffect(() => {
		if (!enableReportEvent) {
			setReportMarker(null);
			setActiveMarker(null);
		}
	}, [enableReportEvent]);

	useEffect(() => {
		// get events, police officers and citizens every 3 seconds
		// update location every 3 seconds
		const interval = setInterval(() => {
			dispatch(getEvents());
			dispatch(getPoliceOfficers());
			dispatch(getCitizens());
			updateLocation();
		}, 3000);

		return () => clearInterval(interval);

	}, [dispatch]);

	useEffect(() => {
		console.log("newestEvent", newestEvent);

		// set the map position to the newest event added
		if (newestEvent && newestEvent.coordinate) {
			setPosition({
				latitude: newestEvent.coordinate.latitude,
				longitude: newestEvent.coordinate.longitude,
				latitudeDelta: 0.005, // 0.0922,		
				longitudeDelta: 0.005, // 0.0421,		
			});

			// setActiveMarker(newestEvent);
			// setShowRoute(true);
		}
	}, [newestEvent]);

	// get user location and update the map properly
	const getLocation = async () => {
		let resf = await Location.requestForegroundPermissionsAsync();

		if (resf.status !== "granted") {
			setErrorMsg("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});

		setPosition({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		});

		setUserPosition({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421,
		});
	};

	// update user location in database
	const updateLocation = async () => {

		// let resf = await Location.requestForegroundPermissionsAsync();
		// let resb = await Location.requestBackgroundPermissionsAsync();
		// if (resf.status !== "granted" && resb.status !== "granted") {
		//   setErrorMsg("Permission to access location was denied");
		//   return;
		// }

		// if (isAuthenticated) {
		//   startLocationTracking();
		// }

		if (isAuthenticated) {
			let resf = await Location.requestForegroundPermissionsAsync();

			if (resf.status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});

			user.coordinate = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			};

			dispatch(updateUserCoordinate(user.email, user.coordinate));
		}
	};

	// const startLocationTracking = async () => {
	//   await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
	//     accuracy: Location.Accuracy.BestForNavigation,
	//     timeInterval: 1000,
	//     showsBackgroundLocationIndicator: true,
	//     foregroundService: {
	//       notificationTitle: "Saferr Location Tracking",
	//       notificationBody: "Used to track your location",
	//       notificationColor: "#FF971D"
	//     },
	//     deferredUpdatesInterval: 1000,
	//     distanceInterval: 1,
	//   });

	//   const hasStarted = await Location.hasStartedLocationUpdatesAsync(
	//     LOCATION_TRACKING
	//   );

	//   console.log('tracking started?', hasStarted);

	//   // locationEmitter.on(LOCATION_UPDATE, (locationData) => {
	//   //   console.log('locationEmitter locationUpdate fired! locationData: ', locationData);
	//   //   let coordinatesAmount = locationData.newRouteCoordinates.length - 1;

	//   //   setUserPosition({
	//   //       latitude: locationData.newRouteCoordinates[coordinatesAmount - 1].latitude,
	//   //       longitude: locationData.newRouteCoordinates[coordinatesAmount - 1].longitude,
	//   //       // routeCoordinates: this.state.routeCoordinates.concat(locationData.newRouteCoordinates)
	//   //   })
	//   // })
	// };

	// if (isAuthenticated) {

	//   TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
	//     if (error) {
	//       console.log('LOCATION_TRACKING task ERROR:', error);
	//       return;
	//     }

	//     if (!isAuthenticated) {
	//       console.log('LOCATION_TRACKING task ERROR: user not authenticated');
	//       return;
	//     }

	//     if (data) {
	//       const { locations } = data;

	//       if (locations[0]) {
	//         let lat = locations[0].coords.latitude;
	//         let long = locations[0].coords.longitude;

	//         setUserPosition({		
	//           latitude: lat,		
	//           longitude: long,		
	//           latitudeDelta: 0.0922,		
	//           longitudeDelta: 0.0421,		
	//         });

	//         user.coordinate = {
	//           latitude: lat,
	//           longitude: long,
	//           latitudeDelta: 0.0922,		
	//           longitudeDelta: 0.0421,	
	//         };

	//         dispatch(updateUserCoordinate(user.email, user.coordinate));

	//         console.log(
	//           `${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
	//         );
	//       }
	//     }
	//   })

	// };  

	// const onRegionChange = (region) => {
	//   setPosition({
	//     latitude: region.latitude,
	//     longitude: region.longitude,
	//     latitudeDelta: region.latitudeDelta,
	//     longitudeDelta: region.longitudeDelta,
	//   });
	// };

	// handle map press
	const onMapPress = (e) => {
		// setMarkers([
		//     ...markers,
		//     {
		//         coordinate: e.nativeEvent.coordinate,
		//         title: "Type of crime",
		//         description: "Crime description",
		//     }
		// ])

		//check if e.nativeEvent.coordinate is not in markers
		// if (!enableReportEvent) {
		//   return;
		// }

		if (enableReportEvent) {
			if (markers.includes(e.nativeEvent.coordinate)) {
				setReportMarker(null);
			}
			else {
				setReportMarker({
					coordinate: e.nativeEvent.coordinate,
				});
			}
		}
		else {
			if (!markers.includes(e.nativeEvent.coordinate)) {
				if (showRoute) {
					setShowRoute(false);
				}
			}
		}
	};

	const handleMarkerPress = (marker) => {
		console.log("marker pressed");
		setActiveMarker(marker);
		setShowModal(true);
	}

	const handleReportMarkerPress = (marker) => {
		// redirect to add crime page
		if (enableReportEvent && reportMarker) {
			console.log("redirect to add crime page");
			setEnableReportEvent(false);
			navigation.navigate("AddCrime", { marker: marker });
		}
	}

	const onPressUpvote = (marker) => {
		console.log("Upvoted");
		// console.log(marker);

		marker.upvotes += 1;
		marker = dispatch(updateEvent(marker._id, marker));
	}

	const onPressDownvote = (marker) => {
		console.log("Downvoted");
		// console.log(marker);

		marker.downvotes += 1;
		marker = dispatch(updateEvent(marker._id, marker));
	}

	const onPressRemoveEvent = (marker) => {
		console.log("Remove event");
		// console.log(marker);

		setActiveMarker(null);
		dispatch(deleteEvent(marker._id));
	}

	const modalBackgroundColor = useColorModeValue('light.primary', 'dark.background');
	const modalTextColor = useColorModeValue('light.text', 'dark.text');

	const mapStyle = useColorModeValue(mapStyleLight, mapStyleDark);

	// console.log(policeOfficersMarkers);

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<MapView
				style={styles.map}
				region={position}
				// ref={c => setMapView(c)}
				// onRegionChange={onRegionChange}
				provider={PROVIDER_GOOGLE}
				customMapStyle={mapStyle}
				showsUserLocation={true}
				followsUserLocation={true}
				showsMyLocationButton={true}
				showsCompass={true}
				showsScale={true}
				showsTraffic={false}
				showsIndoors={false}
				showsBuildings={false}
				showsIndoorLevelPicker={false}
				showsPointsOfInterest={false}
				onPress={onMapPress}
				initialRegion={position}
				toolbarEnabled={false}
				mapPadding={{ top: 29 }}
			>
				{/* events markers */}
				{!enableReportEvent && markers.map((marker, index) => (
					<Marker
						key={index}
						coordinate={marker.coordinate}
						image={require("../assets/map-marker.png")}
						onPress={() => { handleMarkerPress(marker) }}
					/>
				))}

				{/* citizens markers */}
				{!enableReportEvent && citizens.map((marker, index) => (
					<Marker
						key={index}
						coordinate={marker.coordinate}
						image={require("../assets/citizen-location-marker.png")}
						anchor={{ x: 0.5, y: 1.4 }}
					/>
				))}

				{/* police officers markers */}
				{!enableReportEvent && policeOfficersMarkers.map((marker, index) => (
					<Marker
						key={index}
						coordinate={marker.coordinate}
						image={require("../assets/police-car.png")}
						anchor={{ x: 0.5, y: 1.4 }}
					/>
				))}

				{/* report new event marker */}
				{enableReportEvent && reportMarker && (
					<Marker
						coordinate={reportMarker.coordinate}
						image={require("../assets/map-marker.png")}
						onPress={() => { handleReportMarkerPress(reportMarker) }}
					/>
				)}

				{/* show route to active marker */}
				{showRoute && (
					<MapViewDirections
						origin={userPosition}
						destination={activeMarker.coordinate}
						apikey={GOOGLE_MAPS_APIKEY}
						strokeWidth={4}
						strokeColor="#3c9bd3"
						// optimizeWaypoints={true}
						lineDashPattern={[0]}
						drivingOptions={{
							departureTime: new Date(Date.now()),
							trafficModel: "best_guess",
						}}
					// onStart={(params) => {
					// console.log(
					//   `Started routing between "${params.origin}" and "${params.destination}"`
					// );
					// }}
					// onReady={(result) => {
					// console.log(`Distance: ${result.distance} km`);
					// console.log(`Duration: ${result.duration} min.`);
					// setMarker(null)
					// mapView.fitToCoordinates(result.coordinates, {
					//     edgePadding: {
					//         right: (width / 20),
					//         bottom: (height / 20),
					//         left: (width / 20),
					//         top: (height / 20),
					//     }
					// });
					// }}
					/>
				)}

				{activeMarker && (
					<Marker
						coordinate={activeMarker.coordinate}
						image={require("../assets/map-marker.png")}
						onPress={() => { handleReportMarkerPress(activeMarker) }}
					>

						{showModal && (
							<Modal
								isOpen={showModal}
								onClose={() => { setActiveMarker(null); }}
								size="lg"
							>
								<Modal.Content bg={modalBackgroundColor}>
									<Modal.CloseButton onPress={() => { setShowModal(false); /*setActiveMarker(null);*/ }} />
									<Modal.Header bg={modalBackgroundColor}>
										<Text color={modalTextColor} fontWeight={800} >{activeMarker.typeOfCrime}</Text>
									</Modal.Header>
									<Modal.Body bg={modalBackgroundColor}>
										<Text color={modalTextColor} fontWeight={800}>{activeMarker.crimeDescription}</Text>
									</Modal.Body>
									<Modal.Footer bg={modalBackgroundColor}>
										<VStack>
											{(user && user.role != "police" || !user) &&
												(<Button.Group size="md" space={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<Button
														style={{ marginBottom: 10, marginTop: 10, backgroundColor: "green" }}
														rightIcon={<Icon as={Ionicons} name="arrow-up" color="white" size="md" />}
														onPress={() => { onPressUpvote(activeMarker); setShowModal(false); }}
													>
														<Text style={{ color: "white" }}>Upvotes {activeMarker.upvotes}</Text>
													</Button>
													<Button
														style={{ marginBottom: 10, marginTop: 10, backgroundColor: "red" }}
														rightIcon={<Icon as={Ionicons} name="arrow-down" color="white" size="md" />}
														onPress={() => { onPressDownvote(activeMarker); setShowModal(false); }}
													>
														<Text style={{ color: "white" }}>Downvotes {activeMarker.downvotes}</Text>
													</Button>
												</Button.Group>)}

											{user && user.role == "police" &&
												(<Button.Group size="md" space={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<Button
														style={{ marginBottom: 10, marginTop: 10, backgroundColor: "green" }}
														rightIcon={<Icon as={Ionicons} name="person-add-outline" color="white" size="md" />}
														onPress={() => { onPressRemoveEvent(activeMarker); setShowModal(false); }}
													>
														<Text style={{ color: "white" }}>Solve event</Text>
													</Button>
													<Button
														style={{ marginBottom: 10, marginTop: 10, backgroundColor: "red" }}
														rightIcon={<Icon as={Ionicons} name="close-circle-outline" color="white" size="md" />}
														onPress={() => { onPressRemoveEvent(activeMarker); setShowModal(false); }}
													>
														<Text style={{ color: "white" }}>Remove event</Text>
													</Button>

												</Button.Group>)}

											<Button.Group size="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
												{!showRoute &&
													(<Button
														style={{ marginBottom: 10, marginTop: 10, backgroundColor: "lightskyblue" }}
														onPress={() => {
															setShowRoute(!showRoute);
															setShowModal(false);
															console.log(`Show route pressed: ${showRoute}. Active marker: ${activeMarker.coordinate.latitude}`);
														}}
													>
														<Text style={{ color: "white" }}>Show route</Text>
													</Button>)}
											</Button.Group>
										</VStack>

									</Modal.Footer>
								</Modal.Content>
							</Modal>
						)}

					</Marker>
				)}

			</MapView>

			{/* toggle add event button */}
			<View style={styles.toggleAddEventButtonContainer}>
				<ToggleAddEventButton onPress={() => {
					console.log("Toggle add event button pressed");
					setEnableReportEvent(!enableReportEvent);
					setReportMarker(null);
					setActiveMarker(null);
					setShowModal(false);
				}} selected={enableReportEvent} />
			</View>

			{/* {marker && !showRoute && (
                //<View style={styles.ButtonContainer}> 
                    <Button style={styles.Button} bg={buttonBackgroundColor} _text={{color: buttonTextColor}} size="md" onPress={onShowRoutePress}>Show route</Button>
                //</View>
                    
      )} */}

			{/* <View>
        <TouchableOpacity
          style={
            {
              ...styles.menuButton,
              backgroundColor: enableReportEvent ? "green" : "red",
            }
          }
          onPress={() => setEnableReportEvent(prevState => !prevState)}
        >
          <Image
            source={require("../assets/menu.png")}
            style={styles.menuIcon}
          />
          <Text>Toggle add/remove pin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.menuButton, 
          top: 100,
        }} onPress={() => navigation.navigate("Home")}>
          <Text>Navigate to home</Text>
        </TouchableOpacity>
      </View> */}

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
		backgroundColor: "#fff",
		// position: "relative",
		alignItems: 'center',
		justifyContent: 'center',
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		overflow: 'hidden',
	},
	map: {
		flex: 1,
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		overflow: 'hidden'
		// width: "100%",
		// height: "100%",
		// position: "absolute",
	},
	menuIcon: {
		position: "absolute",
		top: 50,
		left: 20
	},
	menuButton: {
		position: "absolute",
		top: 50,
		left: 20,
		backgroundColor: "white",
		padding: 10,
		borderRadius: 10,
		elevation: 10,
	},
	Button: {
		position: 'absolute',
		top: 80,
		left: 16,
		padding: 16,
		borderRadius: 8,
		// width: 100,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 2,
	},
	buttonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	toggleAddEventButtonContainer: {
		position: 'absolute',
		top: 40,
		justifyContent: 'flex-start',
		alignItems: 'center',
	}
});

export default MapComponent;

const mapStyleLight = [
	{
		featureType: "administrative.land_parcel",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.business",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		stylers: [
			{
				weight: 1,
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
];

const mapStyleDark = [
	{
		elementType: "geometry",
		stylers: [
			{
				color: "#1d2c4d",
			},
		],
	},
	{
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#8ec3b9",
			},
		],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#1a3646",
			},
		],
	},
	{
		featureType: "administrative.country",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#4b6878",
			},
		],
	},
	{
		featureType: "administrative.land_parcel",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "administrative.land_parcel",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#64779e",
			},
		],
	},
	{
		featureType: "administrative.province",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#4b6878",
			},
		],
	},
	{
		featureType: "landscape.man_made",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#334e87",
			},
		],
	},
	{
		featureType: "landscape.natural",
		elementType: "geometry",
		stylers: [
			{
				color: "#023e58",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [
			{
				color: "#283d6a",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#6f9ba5",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#1d2c4d",
			},
		],
	},
	{
		featureType: "poi.business",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#023e58",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#3C7680",
			},
		],
	},
	{
		featureType: "road",
		stylers: [
			{
				weight: 1,
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [
			{
				color: "#304a7d",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#98a5be",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#1d2c4d",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [
			{
				color: "#2c6675",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#255763",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#b0d5ce",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#023e58",
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#98a5be",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "labels.text.stroke",
		stylers: [
			{
				color: "#1d2c4d",
			},
		],
	},
	{
		featureType: "transit.line",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#283d6a",
			},
		],
	},
	{
		featureType: "transit.station",
		elementType: "geometry",
		stylers: [
			{
				color: "#3a4762",
			},
		],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#0e1626",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#4e6d70",
			},
		],
	},
];
