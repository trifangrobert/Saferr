import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../components/Error";
import { registerUser } from "../actions/authActions";
import { useColorModeValue, View, Button, Text, Input, ScrollView, Spinner, Stack } from 'native-base';
import { StyleSheet, StatusBar } from "react-native";

const RegisterScreen = ({ navigation }) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [customError, setCustomError] = useState(null);

	const { isLoading, user, error } = useSelector((state) => state.authReducer);

	const dispatch = useDispatch();

	useEffect(() => {
		if (user) {
			navigation.reset({
				index: 0,
				routes: [{ name: "Home" }],
			});
		}
	}, [navigation.navigate, user]);

	const submitForm = (data) => {
		setCustomError(null);
		console.log("data: ", data);

		if (!data.firstName || !data.lastName) {
			setCustomError("Please enter your first and last name");
			return;
		}
		// check if passwords match
		if (data.password !== data.confirmPassword) {
			setCustomError("Password mismatch");
			return;
		}
		if (data.password.length < 8) {
			setCustomError("Password must be at least 8 characters long");
			return;
		}

		// check if email is valid
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			setCustomError("Invalid email");
			return;
		}

		// transform email string to lowercase to avoid case sensitivity issues in login
		data.email = data.email.toLowerCase();

		dispatch(registerUser(data));
	};

	// const handleForgotPassword = () => {
	//   console.log("nasol frate, asta este");
	//   // navigation.navigate("/forgot-password");
	// };

	const backgroundColor = useColorModeValue('light.primary', 'dark.background');
	const textColor = useColorModeValue('light.text', 'dark.text');
	const buttonColor = useColorModeValue('light.background', 'dark.primary');

	return (
		<ScrollView bg={backgroundColor} contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
			<View style={styles.container}>
				{/* <StatusBar barStyle="dark-content" /> */}
				{error && <Error error={error} />}
				{customError && <Error error={customError} />}
				<Text color={textColor} style={styles.title}>Registration Form</Text>
				<Stack space={4} w="90%" maxW="500px" mx="auto">
					<Input
						style={styles.input}
						borderColor={buttonColor}
						placeholder="First Name"
						placeholderTextColor={textColor}
						onChangeText={(text) => setFirstName(text)}
						value={firstName}
						autoComplete="given-name"
						variant="outline"
					/>
					<Input
						style={styles.input}
						borderColor={buttonColor}
						placeholder="Last Name"
						placeholderTextColor={textColor}
						onChangeText={(text) => setLastName(text)}
						value={lastName}
						autoComplete="family-name"
						variant="outline"
					/>
					<Input
						style={styles.input}
						borderColor={buttonColor}
						placeholder="Email"
						placeholderTextColor={textColor}
						onChangeText={(text) => setEmail(text)}
						value={email}
						keyboardType="email-address"
						autoComplete="email"
						variant="outline"
					/>
					<Input
						style={styles.input}
						borderColor={buttonColor}
						placeholder="Password"
						placeholderTextColor={textColor}
						onChangeText={(text) => setPassword(text)}
						value={password}
						secureTextEntry={true}
						variant="outline"
					/>
					<Input
						style={styles.input}
						borderColor={buttonColor}
						placeholder="Confirm Password"
						placeholderTextColor={textColor}
						onChangeText={(text) => setConfirmPassword(text)}
						value={confirmPassword}
						secureTextEntry={true}
						variant="outline"
					/>

					<View style={styles.buttonContainer}>
						{/* <Button
							style={styles.button}
							title="Forgot Password"
							onPress={handleForgotPassword}
							/> 
						*/}
						<Button
							style={styles.button}
							rounded="md"
							bg={buttonColor}
							onPress={() =>
								submitForm({
									firstName,
									lastName,
									email,
									password,
									confirmPassword,
								})
							}
						><Text color={textColor}>Register</Text></Button>
					</View>

					{isLoading && <Spinner size="lg" color="warning.500" />}
				</Stack>
			</View>
		</ScrollView>
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
		marginBottom: 40,
		padding: 10
	},
	input: {
		width: "100%",
		height: 40,
		borderColor: "gray",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		width: "100%",
		marginTop: 20,
	},
	button: {
		width: 100,
		height: 40,
	}
});

export default RegisterScreen;
