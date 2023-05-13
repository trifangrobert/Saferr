import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";
import { Button } from 'native-base';
import Error from "../components/Error";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    dispatch(loginUser(data));
  };
  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent:'center' }}>
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" /> */}
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
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() =>
              submitForm({
                email,
                password,
              })
            }
          >Login</Button>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
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
  button: {
    width: 100,
    height: 40,
  }
});

export default LoginScreen;
