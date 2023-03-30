import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Error from "../components/Error";
// import Spinner from '../components/Spinner'
import { registerUser } from "../actions/authActions";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customError, setCustomError] = useState(null);

  const { loading, userInfo, error, success } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // redirect authenticated user to profile screen
    if (userInfo) navigation.navigate("/profile");
    // redirect user to login page if registration was successful
    if (success) navigation.navigate("/login");
  }, [navigation.navigate, userInfo, success]);

  const submitForm = (data) => {
    // check if passwords match
    if (data.password !== data.confirmPassword) {
      setCustomError("Password mismatch");
      return;
    }
    // transform email string to lowercase to avoid case sensitivity issues in login
    data.email = data.email.toLowerCase();

    dispatch(registerUser(data));
  };

  return (
    <View>
      <StatusBar style="auto" />
      <ScrollView>
        <View>
          <TextInput
            placeholder="First name"
            onChangeText={(text) => setFirstName(text)}
          />
        </View>
        <View>
          <TextInput
            placeholder="Last name"
            onChangeText={(text) => setLastName(text)}
          />
        </View>
        <View>
          <TextInput
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View>
          <TextInput
            placeholder=" Confirm password"
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <TouchableOpacity>
          <Text>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            submitForm({
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
            })
          }
        >
          <Text>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   image: {
//     marginBottom: 40,
//   },
//   inputView: {
//     backgroundColor: "grey",
//     borderRadius: 30,
//     width: "70%",
//     height: 45,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   TextInput: {
//     height: 50,
//     flex: 1,
//     padding: 10,
//     marginLeft: 20,
//   },
//   forgot_button: {
//     height: 30,
//     marginBottom: 30,
//   },
//   loginBtn: {
//     width: "80%",
//     borderRadius: 25,
//     height: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 40,
//     backgroundColor: "grey",
//   },
// });

export default RegisterScreen;
