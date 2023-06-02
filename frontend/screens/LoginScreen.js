import {
  StyleSheet,
  StatusBar,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";
import { View, Button, useColorModeValue, Text, Stack, Input, ScrollView, Spinner } from 'native-base';
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

  const backgroundColor = useColorModeValue('light.primary', 'dark.background');
  const textColor = useColorModeValue('light.text', 'dark.text');
  const buttonColor = useColorModeValue('light.background', 'dark.primary');

  return (
    <ScrollView bg={backgroundColor} contentContainerStyle={{ flex: 1, justifyContent:'center' }}>
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" /> */}
        {error && <Error error={error} />}
        {customError && <Error error={customError} />}

        <Text color={textColor} style={styles.title}>Login Form</Text>
        <Stack space={4} w="90%" maxW="500px" mx="auto">
          <Input
            style={styles.input}
            borderColor={buttonColor}
            placeholder="Email"
            placeholderTextColor={textColor}
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoComplete="email"
            variant="outline"
            keyboardType="email-address"
          />
          <Input
            style={styles.input}
            borderColor={buttonColor}
            placeholder="Password"
            placeholderTextColor={textColor}
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoComplete="password"
            variant="outline"
            secureTextEntry={true}
          />

          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              rounded="md"
              bg={buttonColor}
              onPress={() =>
                submitForm({
                  email,
                  password,
                })
              }
            ><Text color={textColor}>Login</Text></Button>
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

export default LoginScreen;
