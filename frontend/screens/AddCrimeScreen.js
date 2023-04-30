import React, { useState } from "react";
import { View, Text, Button } from "react-native";  
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../actions/eventActions";

const AddCrimeScreen = ({ route, navigation }) => {
    const [crimeType, setCrimeType] = useState("dummy type");
    const [crimeDescription, setCrimeDescription] = useState("dummy description");
    const [crimeDate, setCrimeDate] = useState(null);

    const dispatch = useDispatch();
    const marker = route.params.marker;

    console.log("marker: ", marker);
    
    const handleReport = () => {
        console.log("Report crime");
        let event = {
            typeOfCrime: "dummy type",
            crimeDescription: "dummy description",
            coordinate: {
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
            },
            date: Date.now(),
            email: "dummy email",
        };
        console.log("event: ", event);
        dispatch(createEvent(event));
        navigation.navigate("Map");
    };
    return (
        <View>
            <Text>Add crime screen</Text>
            <Text>CrimeType: {crimeType}</Text>
            <Text>CrimeDescription: {crimeDescription}</Text>
            <Text>CrimeDate: {crimeDate}</Text>
            <Text>Latitude: {marker.coordinate.latitude}</Text>
            <Text>Longitude: {marker.coordinate.longitude}</Text>
            <Button title="Report" onPress={handleReport} />
        </View>
    );
};

export default AddCrimeScreen;
