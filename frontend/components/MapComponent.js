import React from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from "react-native";
import MapView, { Callout } from "react-native-maps";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvents } from "../actions/eventActions";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Modal, useColorModeValue, ScrollView, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

const MapComponent = () => {
  const navigation = useNavigation();
  const [position, setPosition] = useState({
    latitude: 44.435432,
    longitude: 26.102641,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [enableSetEvent, setEnableSetEvent] = useState(false);
  // const mapViewRef = useRef(null);

  const [activeMarker, setActiveMarker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  // dispatch get events  
  const { events: markers } = useSelector((state) => state.eventReducer);

  const isFocused = useIsFocused();

  useEffect (() => {
    // request permission to access location on android
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
    setEnableSetEvent(false);
    setShowRoute(false);
    setActiveMarker(null);
  }, [isFocused]);

  useEffect(() => {
    if (!enableSetEvent) {
      setSelectedMarker(null);
      setActiveMarker(null);
    }
  }, [enableSetEvent]);

  useEffect(() => {
    // setTimeout(() => {
    //   dispatch(getEvents());
    //   setActiveMarker(null);
    // }, 5000);

    //get events every 5 seconds
    const interval = setInterval(() => {
      dispatch(getEvents());
    }, 3000);

    return () => clearInterval(interval);

  }, [dispatch]);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
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
  };

  const onRegionChange = (region) => {
    setPosition({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
  };

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
    if (!enableSetEvent) {
      return;
    }

    if(selectedMarker) {
      setSelectedMarker(null);
      setShowRoute(false);
      return;
    }

    if (markers.includes(e.nativeEvent.coordinate)) {
      setActiveMarker(null);
      setSelectedMarker(null);
      setShowRoute(false);
    }
    else {
      setActiveMarker({
        coordinate: e.nativeEvent.coordinate,
      });
    }
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);

    if (showRoute === true) {
      setActiveMarker(marker);
      setShowModal(true);
    }
    else {
      setShowRoute(true);
    }

    // add event to database
    // const event = {
    //   typeOfCrime: "dummy type of crime",
    //   crimeDescription: "dummy crime description",
    //   coordinate: {
    //     latitude: marker.coordinate.latitude,
    //     longitude: marker.coordinate.longitude,

    //   },
    //   date: new Date(Date.now()),
    //   email: "dummy email",
    // };
    // dispatch(createEvent(event));
  }

  const handleActiveMarkerPress = (marker) => {
    //redirect to add crime page
    //console.log("redirect to add crime page");
    //navigation.navigate("AddCrime", {marker: marker});
  }

  const onPressUpvote = (marker) => {
    console.log("Upvoted");
    //console.log(marker);
  }

  const onPressDownvote = (marker) => {
    console.log("Downvoted");
    //console.log(marker);
  }

  const buttonBackgroundColor = useColorModeValue('light.primary', 'dark.primary');
  const buttonTextColor = useColorModeValue('light.text', 'dark.text');

  const mapStyle = useColorModeValue(mapStyleLight, mapStyleDark);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={position}
        // ref={c => setMapView(c)}
        // onRegionChange={onRegionChange}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        // customMapStyle={mapStyleDark}
        showsUserLocation={true}
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
      >
        {!enableSetEvent && markers.map((marker, index) => (
            <Marker
                key={index}
                coordinate={marker.coordinate}
                image={require("../assets/map-marker.png")}
                onPress={() => {handleMarkerPress(marker)}}
            >
            </Marker>
        ))}

        {showRoute && (
          <MapViewDirections
            origin={position}
            destination={selectedMarker.coordinate}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#2786ab"
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
            onPress={() => {handleActiveMarkerPress(activeMarker)}}
            >

              {showModal && (<Modal
                isOpen={showModal}
                onClose={() => { setActiveMarker(null); }}
                size="md"
              >
                <Modal.Content>
                  <Modal.CloseButton onPress={() => {setShowModal(false)}}/>
                  <Modal.Header>{activeMarker.typeOfCrime}</Modal.Header>
                  <Modal.Body>
                    <ScrollView>
                      <Text style={{color:"white"}}>{activeMarker.crimeDescription}</Text>
                    </ScrollView>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group>
                        <Button 
                          style={{ marginBottom: 10, marginRight: 5, marginTop: 10, backgroundColor: "green" }}
                          rightIcon={<Icon as={Ionicons} name="arrow-up" color="white" size="md"/>}
                          onPress={onPressUpvote(activeMarker)}
                          >
                          <Text style={{color: "white"}}>Upvotes</Text>
                      </Button>
                      <Button 
                          style={{ marginBottom: 10, marginLeft: 5, marginTop: 10, backgroundColor: "red" }}
                          rightIcon={<Icon as={Ionicons} name="arrow-down" color="white" size="md"/>}
                          onPress={onPressDownvote(activeMarker)}
                      >
                          <Text style={{color: "white"}}>Downvotes</Text>
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>)}

            </Marker>
        )}

      </MapView>
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
              backgroundColor: enableSetEvent ? "green" : "red",
            }
          }
          onPress={() => setEnableSetEvent(prevState => !prevState)}
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
    backgroundColor: "#fff",
    // height: Dimensions.get("window").height,
    // width: Dimensions.get("window").width,
    // position: "relative",
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    overflow: 'hidden',
  },
  map: {
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
    //width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // myLocationButton: {
  //     position: 'absolute',
  //     top: 64,
  //     right: 32,
  //     padding: 32,
  //     //display: "flex",
  //     alignItems: 'center',
  //     justifyContent: 'center',
  // }
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
