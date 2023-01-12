import { ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useState } from "react";
import {
  Button,
  Icon,
  Input,
  Text,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import registerBg from "../assets/images/registerBg.jpg";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { account, database } from "../configs/appwriteConfig";
import uuid from "react-native-uuid";
import { AuthContext } from "../context/authContext";
import ModalAlert from "../components/alerts/ModalAlert";

const defaultUser = { name: "", email: "", code: null, password: "" };

const code = 1298;

const RegisterScreen = () => {
  const { theme } = useTheme();
  const { mode } = useThemeMode();
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  const [newUser, setNewUser] = useState(defaultUser);
  const [loading, setLoading] = useState(false);
  const [reEnterCode, setReEnterCode] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [serverError, SetServerError] = useState(false);
  const [serverErrorMsg, SetServerErrorMsg] = useState("");
  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    code: false,
  });

  console.log(newUser);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 12 ? false : true;
  };

  const handleRegister = () => {
    if (newUser.code === 1298) {
      setLoading(true);
      const promise = account.create(
        uuid.v4(),
        newUser.email,
        newUser.password,
        newUser.name
      );

      promise
        .then(
          function (response) {
            const login = account.createEmailSession(
              newUser.email,
              newUser.password
            );
            login.then(
              function (userDetails) {
                setUser(userDetails);
                const createUserRecord = database.createDocument(
                  "autochalid",
                  "userInfo",
                  uuid.v4(),
                  {
                    name: newUser.name,
                    email: newUser.email,
                    userId: userDetails.userId,
                  }
                );

                createUserRecord.then(
                  function (success) {
                    navigation.navigate("Home");
                    setLoading(false);
                  },
                  function (recordError) {
                    setLoading(false);
                    console.log("create record error", recordError);
                    SetServerError(true);
                    SetServerErrorMsg(errecordErroror.message);
                  }
                );
              },
              function (loginError) {
                setLoading(false);
                console.log(loginError);
                SetServerError(true);
                SetServerErrorMsg(loginError.message);
              }
            );
          },
          function (error) {
            setLoading(false);
            console.log(error);
            SetServerError(true);
            SetServerErrorMsg(error.message);
          }
        )
        .catch(function (error) {
          SetServerError(true);
          SetServerErrorMsg(error.message);
        });
    } else {
      setInvalidCode(true);
      setReEnterCode(true);
    }
  };

  const handleInvalidModalClose = () => {
    console.log("shit");
  };

  console.log("invalid email", invalidEmail);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView
        style={{
          backgroundColor: "#343a40",
          paddingHorizontal: 30,
          paddingVertical: 30,
          //   backgroundColor: "#dc3545",
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <Text
          h3
          h3Style={{
            fontFamily: "OpenSans_600SemiBold",
            fontWeight: "600",
            //   fontSize: 30,
            color: "#dee2e6",
          }}
        >
          Start Automating Your Home!
        </Text>
        <View style={{ marginTop: 30 }}>
          <Input
            value={newUser.name}
            placeholder="Name"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidInputs.name ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            autoCapitalize="words"
            leftIcon={<Icon name="person-outline" type="ionicon" />}
            onChangeText={(text) => {
              if (text === "") {
                setInvalidInputs({ ...invalidInputs, name: true });
              } else {
                setInvalidInputs({ ...invalidInputs, name: false });
              }
              setNewUser({ ...newUser, name: text });
            }}
            errorMessage={invalidInputs.name && "Please enter your name!"}
          />
          <Input
            value={newUser.email}
            placeholder="yourname@mail.com"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: !invalidEmail ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Icon name="email" type="fontisto" />}
            onChangeText={(text) => {
              setInvalidEmail(validateEmail(text));
              console.log("from function", validateEmail(text));
              setNewUser({ ...newUser, email: text });
            }}
            errorMessage={!invalidEmail && "Please Enter a Valid Email"}
          />
          <Input
            value={newUser.code}
            placeholder="Access code"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidInputs.code ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            keyboardType="number-pad"
            leftIcon={<Icon name="dots-three-horizontal" type="entypo" />}
            onChangeText={(text) => {
              setReEnterCode(false);
              if (text === "") {
                setInvalidInputs({ ...invalidInputs, code: true });
              } else {
                setInvalidInputs({ ...invalidInputs, code: false });
              }
              setNewUser({ ...newUser, code: parseInt(text) });
            }}
            errorMessage={
              invalidInputs.code
                ? "Please enter your access code!"
                : reEnterCode
                ? "Please Enter Your Code Again"
                : null
            }
          />
          <Input
            value={newUser.password}
            placeholder="Password"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidPassword ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            //   disabled="true"
            secureTextEntry={true}
            autoCapitalize="none"
            leftIcon={<Icon name="lock-closed-outline" type="ionicon" />}
            onChangeText={(text) => {
              setInvalidPassword(validatePassword(text));
              setNewUser({ ...newUser, password: text });
            }}
            errorMessage={
              invalidPassword && "Password must be 8 to 12 characters!"
            }
          />
        </View>
        <Button
          loading={loading}
          title="Register"
          color="success"
          containerStyle={{ borderRadius: 8 }}
          size="lg"
          buttonStyle={{ padding: 15, backgroundColor: "#9fffcb" }}
          titleStyle={{ color: "#1a1a1a", fontFamily: "OpenSans_500Medium" }}
          onPress={handleRegister}
          disabled={Boolean(
            !newUser.name ||
              !invalidEmail ||
              invalidPassword ||
              !newUser.code ||
              !newUser.email ||
              !newUser.password
          )}
          disabledStyle={{ backgroundColor: "grey" }}
        />
        <Button
          title="I have an Account!"
          color="warning"
          containerStyle={{ borderRadius: 8, marginVertical: 30 }}
          size="lg"
          buttonStyle={{
            padding: 15,
            borderColor: "#bfdbf7",
            //   borderWidth: 2,
            borderRadius: 8,
          }}
          titleStyle={{ color: "#bfdbf7", fontFamily: "OpenSans_400Regular" }}
          type="outline"
          onPress={() => navigation.navigate("Login")}
        />
        <Text
          style={{
            textAlign: "center",
            color: "#dee2e6",
            fontFamily: "OpenSans_300Light",
          }}
        >
          Autochalit, an inovative IoT project, Year 2, 2022
        </Text>
      </ScrollView>
      <ModalAlert
        isVisible={invalidCode}
        setIsVisible={setInvalidCode}
        title="Bollocks"
        message="The Access Code you entered seems to be incorrect, please re-check and try again!"
        handleClose={handleInvalidModalClose}
      />
      <ModalAlert
        isVisible={serverError}
        setIsVisible={SetServerError}
        title="Bollocks Server Error!"
        message={serverErrorMsg + ", " + "please try again Later!"}
        handleClose={handleInvalidModalClose}
      />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
