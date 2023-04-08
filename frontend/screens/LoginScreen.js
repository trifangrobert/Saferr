import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Button,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";
import Error from "../components/Error";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customError, setCustomError] = useState(null);

  const { isLoading, user, error } = useSelector((state) => state.auth);

  console.log("isLoading: ", isLoading);
    
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) navigation.navigate("Profile");
  }, [navigation.navigate, user]);

  const submitForm = (data) => {
    setCustomError(null);
    console.log("data: ", data);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setCustomError("Invalid email");
      return;
    }
    if (!data.password) {
      setCustomError("Please enter your password");
      return;
    }

    data.email = data.email.toLowerCase();

    // clean the navigation stack and redirect to home
    navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
    });

    dispatch(loginUser(data));
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {error && <Error error={error} />}
        {customError && <Error error={customError} />}

        <Text style={styles.title}>Login Form</Text>
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
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Login"
          onPress={() =>
            submitForm({
              email,
              password,
            })
          }
        />
      </View>
      <ActivityIndicator size="large" color="#0000ff" animating={isLoading} />
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

export default LoginScreen;
