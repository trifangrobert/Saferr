import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createEvent } from "../actions/eventActions";
import { useColorModeValue, VStack, View, Text, Button, Select, Input } from "native-base";

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
			alert("You need to be logged in to report a crime!");
			return;
		}
		let event = {
			typeOfCrime: crimeType,
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

	const backgroundColor = useColorModeValue('light.background', 'dark.background');
	const textColor = useColorModeValue('light.text', 'dark.text');
	const buttonColor = useColorModeValue('light.primary', 'dark.primary');

	return (
		<View style={styles.container} bg={backgroundColor}>
			<VStack space={4} w="90%" maxW="500px" mx="auto" justifyContent="center" alignItems="center" safeAreaTop>

				{/* crime type */}
				<Text color={textColor} style={styles.title}>Report new crime</Text>
				<Select selectedValue={crimeType} borderColor={buttonColor} color={textColor} placeholder="Choose crime type" width="100%" onValueChange={(itemValue, itemIndex) => setCrimeType(itemValue)}>
					{options.map((option) => (
						<Select.Item
							key={option.value}
							label={option.label}
							value={option.value}
						/>
					))}
				</Select>

				{/* crime description */}
				<Text color={textColor} style={styles.title} marginTop={10}>Describe the crime</Text>
				<Input
					width="100%"
					placeholder="Crime description"
					placeholderTextColor={textColor}
					onChangeText={(text) => setCrimeDescription(text)}
					value={crimeDescription}
					variant="outline"
					borderColor={buttonColor}
					color={textColor}
				/>

				<Button
					style={styles.button}
					rounded="md"
					bg={buttonColor}
					onPress={handleReport}
				>
					<Text color={textColor}>Report</Text>
				</Button>
			</VStack>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 20,
		padding: 10
	},
	button: {
		width: 100,
		height: 40,
		marginTop: 20
	}
});

export default AddCrimeScreen;
