import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Error from "../components/Error";
import { registerUser } from "../actions/authActions";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customError, setCustomError] = useState(null);

  const { isLoading, user, error } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) navigation.navigate("Profile");
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

    // clean the navigation stack and redirect to home
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });

    dispatch(registerUser(data));
  };

  const handleForgotPassword = () => {
    console.log("nasol frate, asta este");
    // navigation.navigate("/forgot-password");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {error && <Error error={error} />}
        {customError && <Error error={customError} />}
        <Text style={styles.title}>Registration Form</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          autoComplete="given-name"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          autoComplete="family-name"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          {/* <Button
            style={styles.button}
            title="Forgot Password"
            onPress={handleForgotPassword}
          /> */}
          <Button
            style={styles.button}
            title="Register"
            onPress={() =>
              submitForm({
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
              })
            }
          />
        </View>
        <ActivityIndicator size="large" color="#0000ff" animating={isLoading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
});

export default RegisterScreen;
