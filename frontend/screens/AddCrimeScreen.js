import React, { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, TextInput } from "react-native";  
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../actions/eventActions";
import { Picker } from "@react-native-picker/picker";

const options = [
    {
        value: "Robbery", label: "Robbery"
    },
    {
        value: "Assault", label: "Assault"
    },
    {
        value: "Burglary", label: "Burglary"
    },
    {
        value: "Drug trafficking", label: "Drug trafficking"
    },
    {
        value: "Vandalism", label: "Vandalism"
    },
    {
        value: "Arson", label: "Arson"
    },
    {
        value: "Other", label: "Other"
    }
];

const AddCrimeScreen = ({ route, navigation }) => {
    const [crimeType, setCrimeType] = useState("Robbery");
    const [crimeDescription, setCrimeDescription] = useState("");
    

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer);

    const marker = route.params.marker;

    console.log("marker: ", marker);
    
    const handleReport = () => {
        console.log("Report crime");
        console.log(marker);
        console.log("user: ", user);

        if (!user) {
            alert("You need to be logged in to report a crime");
            return;
        }
        let event = {
            typeOfCrime: crimeType, // typeOfCrime: crimeType
            crimeDescription: crimeDescription,
            coordinate: {
                latitude: marker.coordinate.latitude,
                longitude: marker.coordinate.longitude,
            },
            date: Date.now(),
            email: user.email,
        };
        console.log("event: ", event);
        dispatch(createEvent(event));
        navigation.navigate("Map");
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Add crime screen</Text>
                <Picker selectedValue={crimeType} onValueChange={(itemValue, itemIndex) => setCrimeType(itemValue)}>
                    {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                        />
                    ))}
                </Picker>
                <Text style={styles.text}>Describe the crime</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Describe the crime"
                    onChangeText={(text) => setCrimeDescription(text)}
                    value={crimeDescription}
                />
                <Button title="Report" onPress={handleReport} />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
});

export default AddCrimeScreen;
